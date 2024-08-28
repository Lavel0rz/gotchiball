use rapier2d::prelude::*;
use warp::Filter;
use serde::{Serialize, Deserialize};
use std::sync::{Arc, Mutex};

#[derive(Serialize, Deserialize)]
struct PhysicsState {
    balls: Vec<(f32, f32)>, // Store the positions of all balls
}

#[derive(Serialize, Deserialize)]
struct UpdatePosition {
    position: (f32, f32),
}

// Represent a ball's state
#[derive(Clone)]
struct Ball {
    body_handle: RigidBodyHandle,
    position: (f32, f32),
}

#[derive(Default)]
struct SharedState {
    gotchi_position: (f32, f32),
    balls: Vec<Ball>, // Store multiple balls
}

#[tokio::main]
async fn main() {
    let shared_state = Arc::new(Mutex::new(SharedState {
        gotchi_position: (400.0, 100.0),
        balls: Vec::new(),
    }));

    let gravity = vector![0.0, 200.0]; // Realistic gravity
    let integration_parameters = IntegrationParameters::default();
    
    // Wrap physics resources in Arc<Mutex<...>>
    let mut physics_pipeline = PhysicsPipeline::new();
    let island_manager = Arc::new(Mutex::new(IslandManager::new()));
    let broad_phase = Arc::new(Mutex::new(DefaultBroadPhase::new()));
    let narrow_phase = Arc::new(Mutex::new(NarrowPhase::new()));
    let impulse_joint_set = Arc::new(Mutex::new(ImpulseJointSet::new()));
    let multibody_joint_set = Arc::new(Mutex::new(MultibodyJointSet::new()));
    let ccd_solver = Arc::new(Mutex::new(CCDSolver::new()));
    let query_pipeline = Arc::new(Mutex::new(QueryPipeline::new()));

    // Wrap rigid body set and collider set in Arc<Mutex<...>> for sharing
    let rigid_body_set = Arc::new(Mutex::new(RigidBodySet::new()));
    let collider_set = Arc::new(Mutex::new(ColliderSet::new()));

    // Create static edges of the game area
    {
        let mut rigid_body_set = rigid_body_set.lock().unwrap();
        let ground_body_handle = rigid_body_set.insert(RigidBodyBuilder::fixed().translation(vector![400.0, 900.0]).build());
        collider_set.lock().unwrap().insert_with_parent(ColliderBuilder::cuboid(400.0, 10.0).build(), ground_body_handle, &mut rigid_body_set);

        let top_body_handle = rigid_body_set.insert(RigidBodyBuilder::fixed().translation(vector![400.0, 0.0]).build());
        collider_set.lock().unwrap().insert_with_parent(ColliderBuilder::cuboid(400.0, 10.0).build(), top_body_handle, &mut rigid_body_set);

        let left_body_handle = rigid_body_set.insert(RigidBodyBuilder::fixed().translation(vector![0.0, 450.0]).build());
        collider_set.lock().unwrap().insert_with_parent(ColliderBuilder::cuboid(10.0, 450.0).build(), left_body_handle, &mut rigid_body_set);

        let right_body_handle = rigid_body_set.insert(RigidBodyBuilder::fixed().translation(vector![800.0, 450.0]).build());
        collider_set.lock().unwrap().insert_with_parent(ColliderBuilder::cuboid(10.0, 450.0).build(), right_body_handle, &mut rigid_body_set);
    }

    // Start the physics simulation in a separate task
    let shared_state_clone = Arc::clone(&shared_state);
    let rigid_body_set_clone = Arc::clone(&rigid_body_set);
    let collider_set_clone = Arc::clone(&collider_set);
    
    tokio::spawn(async move {
        loop {
            // Step the physics simulation
            {
                // Lock physics components for the step
                let mut rigid_body_set = rigid_body_set_clone.lock().unwrap();
                let mut collider_set = collider_set_clone.lock().unwrap();
                let mut island_manager = island_manager.lock().unwrap();
                let mut broad_phase = broad_phase.lock().unwrap();
                let mut narrow_phase = narrow_phase.lock().unwrap();
                let mut impulse_joint_set = impulse_joint_set.lock().unwrap();
                let mut multibody_joint_set = multibody_joint_set.lock().unwrap();
                let mut ccd_solver = ccd_solver.lock().unwrap();
                let mut query_pipeline = query_pipeline.lock().unwrap();

                // Step the physics simulation
                physics_pipeline.step(
                    &gravity,
                    &integration_parameters,
                    &mut *island_manager,
                    &mut *broad_phase,
                    &mut *narrow_phase,
                    &mut *rigid_body_set,
                    &mut *collider_set,
                    &mut *impulse_joint_set,
                    &mut *multibody_joint_set,
                    &mut *ccd_solver,
                    Some(&mut *query_pipeline),
                    &(),
                    &(),
                );

                // Update ball positions in the shared state
                {
                    let mut state = shared_state_clone.lock().unwrap();
                    for ball in &mut state.balls {
                        let ball_body = &rigid_body_set[ball.body_handle];
                        ball.position = (ball_body.translation().x, ball_body.translation().y);
                    }
                }
            } // Lock is dropped here

            // Sleep for a short duration (~60 FPS)
            tokio::time::sleep(tokio::time::Duration::from_millis(16)).await;
        }
    });

    // Define the route for getting physics state (ball positions)
    let get_physics_state = {
        let shared_state = Arc::clone(&shared_state);
        warp::path("physics")
            .and(warp::get())
            .map(move || {
                let state = shared_state.lock().unwrap();
                warp::reply::json(&PhysicsState {
                    balls: state.balls.iter().map(|b| b.position).collect(),
                })
            })
    };

    // Define the route for spawning a ball
    let spawn_ball = {
        let shared_state = Arc::clone(&shared_state);
        let rigid_body_set_clone = Arc::clone(&rigid_body_set);
        let collider_set_clone = Arc::clone(&collider_set);
        
        warp::path("spawn")
            .and(warp::post())
            .map(move || {
                // Set fixed spawn position at the top center of the screen
                let spawn_x = 400.0; // Center of the screen horizontally
                let spawn_y = 50.0;  // A bit below the top edge

                // Create a new ball and add it to the shared state
                let rigid_body = RigidBodyBuilder::dynamic()
                    .translation(vector![spawn_x, spawn_y])
                    .ccd_enabled(true) // Enable Continuous Collision Detection
                    .build();

                // Create a ball collider with restitution for bouncing
                let ball_collider = ColliderBuilder::ball(20.0) // Radius of the ball
                    .restitution(0.7) // Bounciness
                    .friction(0.3) // Adjust friction as needed
                    .build();

                // Lock the rigid body set and collider set for safe access
                let mut rigid_body_set = rigid_body_set_clone.lock().unwrap();
                let mut collider_set = collider_set_clone.lock().unwrap();
                
                // Insert the rigid body and collider into their respective sets
                let ball_body_handle = rigid_body_set.insert(rigid_body);
                collider_set.insert_with_parent(ball_collider, ball_body_handle, &mut rigid_body_set);

                // Create a new ball instance to keep track of it
                let new_ball = Ball {
                    body_handle: ball_body_handle,
                    position: (spawn_x, spawn_y),
                };

                // Update the shared state with the new ball
                let mut state = shared_state.lock().unwrap();
                state.balls.push(new_ball.clone()); // Add new ball to the shared state

                println!("Spawned a new ball at position: {:?}", (spawn_x, spawn_y));
                
                // Respond with the new ball's position
                warp::reply::json(&new_ball.position)
            })
    };

    // Define the route for updating the gotchi position
    let update_gotchi_position = {
        let shared_state = Arc::clone(&shared_state);
        warp::path("update")
            .and(warp::post())
            .and(warp::body::json())
            .map(move |body: UpdatePosition| {
                // Update the shared position with boundaries
                let mut state = shared_state.lock().unwrap();
                let new_x = body.position.0;
                let new_y = body.position.1;

                // Enforce boundaries (assuming boundaries are 800x900)
                state.gotchi_position.0 = new_x.clamp(0.0, 800.0);
                state.gotchi_position.1 = new_y.clamp(0.0, 900.0);

                println!("Updated gotchi position: {:?}", state.gotchi_position);
                
                // Respond with the updated position
                warp::reply::json(&state.gotchi_position) // Respond with the updated position
            })
    };

    // CORS configuration
    let cors = warp::cors()
        .allow_any_origin() // Allows all origins. Modify as needed for production.
        .allow_headers(vec!["Content-Type"])
        .allow_methods(vec!["GET", "POST", "OPTIONS"]);

    // Combine the routes with CORS
    let routes = get_physics_state.or(spawn_ball).or(update_gotchi_position).with(cors);

    // Start the warp server
    warp::serve(routes)
        .run(([127, 0, 0, 1], 3030))
        .await;
}

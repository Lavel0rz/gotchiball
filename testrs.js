const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 900,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let gotchi; // Player sprite
let balls = []; // Array to hold ball sprites
let lastGotchiPosition = { x: 400, y: 100 }; // Initialize with the starting position
let ballPositions = []; // Array to hold positions of multiple balls
let canSpawnBall = true; // Debounce flag

function preload() {
    // Preload images
    this.load.image('gotchi', 'src/gotchi.png'); // Path to gotchi image
    this.load.image('ball', 'src/ball.png'); // Path to ball image
}

function create() {
    // Create the gotchi using the gotchi image
    gotchi = this.add.sprite(lastGotchiPosition.x, lastGotchiPosition.y, 'gotchi').setScale(0.1);
    
    // Enable keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Add spacebar key

    // Add listener for space key press
    this.input.keyboard.on('keydown-SPACE', spawnBall, this);

    // Start fetching physics state from the server
    this.time.addEvent({
        delay: 1000 / 60, // 60 FPS
        callback: fetchPhysicsState,
        callbackScope: this,
        loop: true
    });
}

function update() {
    // Move the gotchi based on keyboard input
    let moved = false;

    if (this.cursors.left.isDown) {
        gotchi.x -= 5; // Move left
        moved = true;
    } else if (this.cursors.right.isDown) {
        gotchi.x += 5; // Move right
        moved = true;
    }

    if (this.cursors.up.isDown) {
        gotchi.y -= 5; // Move up
        moved = true;
    } else if (this.cursors.down.isDown) {
        gotchi.y += 5; // Move down
        moved = true;
    }

    // Check if the position has changed
    if (moved && (gotchi.x !== lastGotchiPosition.x || gotchi.y !== lastGotchiPosition.y)) {
        // Update last known position
        lastGotchiPosition.x = gotchi.x;
        lastGotchiPosition.y = gotchi.y;

        // Send position update to the server
        sendPositionUpdate();
    }

    // Update ball positions in the scene
    balls.forEach((ball, index) => {
        if (ballPositions[index]) {
            ball.setPosition(ballPositions[index].x, ballPositions[index].y);
        }
    });
}

async function fetchPhysicsState() {
    try {
        const response = await fetch('http://127.0.0.1:3030/physics');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        // Update the ball positions from server
        if (data.balls && data.balls.length > 0) {
            ballPositions = data.balls.map((position) => ({ x: position[0], y: position[1] }));

            // Create or update ball sprites based on fetched positions
            while (balls.length < ballPositions.length) {
                // Create new ball sprites for any new positions
                const newBall = this.add.sprite(ballPositions[balls.length].x, ballPositions[balls.length].y, 'ball').setScale(0.1);
                balls.push(newBall);
            }
        }
    } catch (error) {
        console.error('Error fetching physics state:', error);
    }
}

async function sendPositionUpdate() {
    const position = { position: [gotchi.x, gotchi.y] }; // Send the gotchi's current position

    try {
        const response = await fetch('http://127.0.0.1:3030/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(position),
        });
        if (!response.ok) throw new Error('Failed to update position');

        const data = await response.json(); // Optional: handle the response if needed
        console.log('Gotchi position updated to:', data);
    } catch (error) {
        console.error('Error updating position:', error);
    }
}

async function spawnBall() {
    if (!canSpawnBall) return; // Prevent spawning if already spawning a ball

    canSpawnBall = false; // Set the flag to prevent further spawns

    try {
        const response = await fetch('http://127.0.0.1:3030/spawn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to spawn ball');

        // Fetch the updated physics state to get the new ball positions
        await fetchPhysicsState();

        console.log('New ball spawned');
    } catch (error) {
        console.error('Error spawning ball:', error);
    } finally {
        canSpawnBall = true; // Reset the flag after the spawn process is complete
    }
}

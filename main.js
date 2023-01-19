import "phaser";

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: {
    preload,
    create,
    update,
  },
  input: {
    mouse: true, // enable mouse input
  },
};
let x;
let loffset = false
let shipCircle
let retainTimeout;
let ballReachedProximity = false;
const maxSpeed = 1;
const game = new Phaser.Game(config);
let timeSinceLastHit = 0;
let retainTimer;
let retained = false;
let collisionCounter = 0;
let canShoot  = false
let pointer;
let sound;
let shootTimer;
let BOUNCE_FORCE = 500;
let angle1;
let lickexists;
let lickangle;
let angle2;
let ballCollidedWithWorldBounds = false;
let ship1;
let ship4;
let scoreText1;
let scoreText2;
let shipmoving = true;
let shipmoving2 = true;
let min = 1;
let min2 = 200;
let spaceBar;
let max = 360;
let randomNumber1 = Math.random() * (max - min) + min;
let randomNumber2 = Math.random() * (max - min) + min;
let randomNumber3 = Math.random() * (max - min) + min;
let circle;
let goal1;
let goal2;
let arrow;
let rofl;
let arrow2;
let licksound;
let goal3;
let goal4;
let ship3;
let goal5;
let ballCanShoot = true;
let ship2;
let topWall;
let bottomWall;
let graphics;
let post;
let post2;
let plasma;
let bottomrofl;
let leftWall;
let rightWall;
let topWall2;
let bottomWall2;
let leftWall2;
let laser;
let rightWall2;
let goal
let boostAmountText;
let ball;
let score1 = 0;
let score2 = 0;
let lastCollidingShip;
let tonguemitter;
let tongueparticles;
let particles;
let emitter;
let gun;
let boostAmount = 200;
let arrow3;
let boostRegenTimer = 0;
let cursors;

let boost = false; // variable to track the boost value
const velocityX = 0;
const velocityY = 0;
function preload() {
  this.load.image("ship", require("../src/coderdan.png"));
  this.load.image("ship2", require("../src/coderdan.png"));
  this.load.image("ship3", require("../src/goldenxross.png"));

  this.load.image("ball", require("../src/balled2.png"));
  this.load.image("particle", require("../src/fireball1.png"));
  this.load.image("goal", require("../src/goal.png"));
  this.load.image("wall", require("../src/wall.png"));
  this.load.image("verticalwall", require("../src/verticalwall.png"));
  this.load.image("background", require("../src/nebula.png"));
  this.load.audio("shooting", require("../src/shooting.wav"));
  this.load.audio("goalsound", require("../src/goalsound.wav"));
  this.load.audio("boost", require("../src/boost.wav"));
  this.load.audio("boost2", require("../src/boost2.wav"));
 
  this.load.audio("ballcol1", require("../src/ballcol.wav"));

  this.load.image("arrow", require("../src/ghsttok.png"));
  this.load.image("arrow2", require("../src/ghsttok.png"));
  this.load.image("background2", require("../src/background2.png"));
  this.load.image("down", require("../src/downsvg.png"));
  this.load.image("up", require("../src/backsvg.png"));
  this.load.image("left", require("../src/leftsvg.png"));
  this.load.image("right", require("../src/right.png"));
 




  
  this.load.image("gun", require("../src/gun.png"));
  this.load.image("plasma", require("../src/plamsaball.png"));
  this.load.image("pixel", require("../src/pixelcraft.png"));
  this.load.audio("plasmagun", require("../src/plasmagun.wav"));
  this.load.image("goal1", require("../src/goal1.png"));
  this.load.image("observor", require("../src/observor2.png"));
  this.load.image("pinkrofl", require("../src/rofl.png"));
}

function create() {



  x = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SHIFT
    // Enable boost mode
   
  );
  
  spaceBar = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
 );
 lickexists = this.background2 = this.add.tileSprite(
   0,
   0,
   this.game.config.width,
   this.game.config.height,
   "background2"
 );
 this.background2.setOrigin(0, 0);
 this.background2.setTilePosition(0, 0);
 this.input.setDefaultCursor("crosshair");
 this.graphics = this.add.graphics();
 this.graphics.lineStyle(5, 0x9400D3, 1);
 this.graphics.beginPath();
 this.graphics.moveTo(50, 50);
 this.graphics.lineTo(config.width-50, 50);
 this.graphics.closePath();
 this.graphics.stroke();



 this.graphics = this.add.graphics();
 this.graphics.lineStyle(5, 0x9400D3, 1);
 this.graphics.beginPath();
 this.graphics.moveTo(50, config.height - 50);
 this.graphics.lineTo(config.width-50, config.height - 50);
 this.graphics.closePath();
 this.graphics.stroke();


 scoreText1 = this.add.text(16, 16, "Ship 1: 0", {
   fontSize: "32px",
   fill: "#FFF",
 });
 scoreText1.setText(`Observoor: ${score1}`);
 scoreText2 = this.add.text(16, 48, "Ship 2: 0", {
   fontSize: "32px",
   fill: "#FFF",
 });
 scoreText2.setText(`Pixelstuds: ${score2}`);
 this.graphics = this.add.graphics();
 this.graphics.lineStyle(5, 0x9400D3, 1);
 this.graphics.beginPath();
 this.graphics.moveTo(config.width/2, 50);
 this.graphics.lineTo(config.width/2, config.height -50);
 this.graphics.closePath();
 this.graphics.stroke();
 // set the size of the wall images
 this.graphics = this.add.graphics();
this.graphics.fillStyle(0x9400D3, 1);
this.graphics.lineStyle(5, 0x9400D3, 4);
this.graphics.beginPath();
this.graphics.arc(config.width/2, config.height/2, 100, 0, Math.PI * 2);
this.graphics.closePath();
this.graphics.stroke();
this.graphics = this.add.graphics();
this.graphics.lineStyle(5, 0x9400D3, 1);
this.graphics.beginPath();
this.graphics.moveTo(config.width-50 , 50);
this.graphics.lineTo(config.width -50, config.height -50);
this.graphics.closePath();
this.graphics.stroke();
this.graphics = this.add.graphics();
this.graphics.lineStyle(5, 0x9400D3, 1);
this.graphics.beginPath();
this.graphics.moveTo(50, 50);
this.graphics.lineTo(50, config.height-50);
this.graphics.closePath();
this.graphics.stroke();





 
ship1 = this.physics.add.image(700, 700, "observor");
post = this.physics.add.image(config.width-20, config.height/2+80, 'wall');
post2 = this.physics.add.image(config.width-20, config.height/2-80, 'wall');
goal = this.physics.add.image(config.width-15, config.height/2-53, 'goal');
goal = this.physics.add.image(config.width-15, config.height/2-20, 'goal');
goal = this.physics.add.image(config.width-15, config.height/2+13, 'goal');
goal = this.physics.add.image(config.width-15, config.height/2+46, 'goal');
goal.setAlpha(0.6)
post.setBounce(1)
post.setImmovable(true)
post2.setBounce(1)
post2.setImmovable(true)


 ship1.setScale(0.35);
 ship1.setCollideWorldBounds(true);
 ship1.setBounce(1);
 ship1.setDamping(2);
 ship1.setCircle(60)

 
 this.physics.collide(ship1, topWall);
 this.physics.collide(ship1, bottomrofl);
 this.physics.collide(ship1, leftWall);
 this.physics.collide(ship1, rightWall);


 plasma = this.physics.add.image("plasma");
 


 



 // draw a circle on the graphics object



 circle = new Phaser.Geom.Circle(ship1.x, ship1.y, ship1.width/2);
this.physics.add.existing(circle);
circle.body.setCircle(circle.radius);
this.add.existing(circle);

 ball = this.physics.add.image(450, 450, "ball");
 ball.setScale(1.25)
 ballCanShoot = false;
 ball.setCircle(10)



 ball.setTint(0xff0000); // set ball to red
 setTimeout(() => {
   ball.clearTint();
   ballCanShoot = true;
 }, 3500);

 ball.setCollideWorldBounds(true);
 ball.setBounce(0.7) // make the ball bounce off the walls
 ball.body.onWorldBounds = function (ball) {
   console.log("Game object has collided with world bounds!");
   this.sound.play("ballcol1", { volume: 0.1 });
 };




 this.input.keyboard.on("keydown-SHIFT", function () {
  // Enable boost mode
  boost = true;
});

 this.input.keyboard.on("keyup-SHIFT", function () {
   // Disable boost mode
   boost = false;
 });
 ball.body.onCollide = true;
 ball.body.onCollideCallback = (collisionObject) => {
   if (collisionObject.gameObject instanceof ship1) {
       ball.body.applyImpulse(
           new Phaser.Math.Vector2(-collisionObject.overlapX, -collisionObject.overlapY).normalize().scale(0.1)
       );
   }
}






}

function update() {
  this.physics.collide(ship1, post);
  this.physics.collide(ship1, post2);
  this.physics.collide(post, ball);
  this.physics.collide(post2, ball);
  let shiftKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SHIFT
  );

  
  shipCircle = new Phaser.Geom.Circle(ship1.x, ship1.y, ship1.width / 2);

  
 ball.setVelocity(ball.body.velocity.x * 0.996, ball.body.velocity.y * 0.996);
 this.physics.collide(ship1, ball);

 this.physics.add.collider(ball, ship1, function () {
  if (spaceBar.isDown) {
    let angle = Phaser.Math.Angle.Between(ship1.x, ship1.y, ball.x, ball.y);
    angle += Math.PI;  // add 180 degrees to the angle to make it opposite direction
    ball.body.setVelocity(-Math.cos(angle) * 500, -Math.sin(angle) * 500);
  }
});

this.physics.add.collider(ball, ship1, function () {
  if (shiftKey.isDown) {
    let angle = Phaser.Math.Angle.Between(ship1.x, ship1.y, ball.x, ball.y);
    angle += Math.PI;  // add 180 degrees to the angle to make it opposite direction
    ball.body.setVelocity(-Math.cos(angle) * 100, -Math.sin(angle) * 100);
  }
});
  
  
  

 
  this.physics.world.on(
    "worldbounds",
    function (body) {
      if (body.gameObject === ball && !ballCollidedWithWorldBounds) {
        // ball has collided with the world bounds
        this.sound.play("ballcol1", { volume: 0.1 });

        ballCollidedWithWorldBounds = true;
        setTimeout(() => {
          ballCollidedWithWorldBounds = false;
        }, 100);
      }
    },
    this
  );
  function respawnBall1() {
    canShoot = false;
   
      score1++;
   
 
    ballCanShoot = false; // set the flag to false when the ball respawns
    ball.x = game.config.width / 2;
    ball.y = game.config.height / 2;
    ball.setVelocity(0);
    ball.setTint(0xff0000); // set ball to red
    this.sound.play("goalsound", { volume: 0.2 });
    console.log("ballrespawning");
    this.scene.restart();
    ball.setTint(0xff0000);
  }
  function respawnBall2() {
    canShoot = false;
   
      score2++;
   
 
    ballCanShoot = false; // set the flag to false when the ball respawns
    ball.x = game.config.width / 2;
    ball.y = game.config.height / 2;
    ball.setVelocity(0);
    ball.setTint(0xff0000); // set ball to red
    this.sound.play("goalsound", { volume: 0.2 });
    console.log("ballrespawning");
    this.scene.restart();
    ball.setTint(0xff0000);
  }
  

  this.physics.collide(ball, goal5);
  this.physics.add.collider(ball, goal1, respawnBall1, null, this);
  //this.physics.add.collider(ball, goal2, respawnBall, null, this);
  this.physics.add.collider(ball, goal3, respawnBall2, null, this);
 

  this.physics.collide(ball, topWall);

  this.physics.collide(ball, bottomrofl);
  this.physics.collide(ball, leftWall);
  this.physics.collide(ball, rightWall);
  this.physics.collide(ship1, topWall);
  this.physics.collide(ship1, bottomrofl);
  this.physics.collide(ship1, leftWall);
  this.physics.collide(ship1, rightWall);
;

;



  let wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  let aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  let sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  let dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);



  if (wKey.isDown && shipmoving) {
    ship1.setVelocityY(-100);
  
  
} else if (sKey.isDown && shipmoving) {
    ship1.setVelocityY(100);
   
   
} else {
    ship1.setVelocityY(0);
   
}
  
if (aKey.isDown && shipmoving) {
  loffset = true
  ship1.setVelocityX(-100);
  
 


} else if (dKey.isDown && shipmoving) {
  ship1.setVelocityX(100);
  
 
} else {
  ship1.setVelocityX(0);
  
}
}

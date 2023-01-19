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
let lineBody
let graphics2
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
let rightLine2
let post2;
let leftLine
let rightLine
let plasma;
let bottomrofl;
let leftWall;
let rightWall;
let topWall2;
let goalLine
let bottomWall2;
let leftWall2;
let laser;
let rightWall2;
let goal
let boostAmountText;
let post3
let post4
let ball;
let score1 = 0;
let line
let bottomLine
let score2 = 0;
let inverse_leftLine
let inverse_leftLine2
let lastCollidingShip;
let tonguemitter;
let goalLine2;
let tongueparticles;
let particles;
let emitter;
let topLine
let gun;
let boostAmount = 200;
let arrow3;
let boostRegenTimer = 0;
let cursors;

let boost = false; // variable to track the boost value
const velocityX = 0;
const velocityY = 0;
function preload() {


  this.load.image("ball", require("../src/balled2.png"));


  this.load.image("wall", require("../src/wall.png"));



  this.load.audio("goalsound", require("../src/goalsound.wav"));



  this.load.image("background2", require("../src/background2.png"));








  this.load.image("observor", require("../src/observor2.png"));

}

function create() {
  //this.physics.world.createDebugGraphic();



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
topLine = this.add.image(config.width/2, 50, 'line');
topLine.displayWidth = config.width - 100;
topLine.displayHeight = 1;

// enable physics for the line
this.physics.add.existing(topLine);

// set the size of the physics body to match the line

topLine.body.setImmovable(true);
topLine.body.setAllowGravity(false);


rightLine = this.add.image(config.width-50, config.height+240, 'line');
rightLine.displayWidth = 1;
rightLine.displayHeight = config.width-300;

bottomLine = this.add.image(config.width/2, config.height - 50, 'bottomLine');
bottomLine.displayWidth = config.width - 100;
bottomLine.displayHeight = 1;


this.physics.add.existing(rightLine);
this.physics.add.existing(bottomLine);

rightLine.body.setImmovable(true);
bottomLine.body.setImmovable(true);
topLine.alpha=0

rightLine.alpha = 0;
bottomLine.alpha=0;

rightLine2 = this.add.image(config.width-50, 50, 'line');
rightLine2.displayWidth = 1;
rightLine2.displayHeight = config.height - 250;

this.physics.add.existing(rightLine2);
rightLine2.body.setImmovable(true);
rightLine2.alpha = 0

inverse_leftLine = this.add.image(50, config.height+240, 'line');
inverse_leftLine.displayWidth = 1;
inverse_leftLine.displayHeight = config.width-300;

inverse_leftLine2 = this.add.image(50, 50, 'line');
inverse_leftLine2.displayWidth = 1;
inverse_leftLine2.displayHeight = config.height - 250;


inverse_leftLine.alpha= 0
inverse_leftLine2.alpha = 0
this.physics.add.existing(inverse_leftLine);
this.physics.add.existing(inverse_leftLine2);
inverse_leftLine.body.setImmovable(true);
inverse_leftLine2.body.setImmovable(true);




 




 

post = this.physics.add.image(config.width-20, config.height/2+80, 'wall');
post2 = this.physics.add.image(config.width-20, config.height/2-80, 'wall');
let graphics2 = this.add.graphics();
graphics2.lineStyle(35, 0x9400D3, 1); // set line thickness to 10, color to red, and alpha to 1
graphics2.moveTo(config.width-10, config.height/2-68); // set starting point of line
graphics2.lineTo(config.width-10, config.height/2+68); // set ending point of line
graphics2.stroke(); // draw the line on the screen
let graphics3 = this.add.graphics();
graphics3.lineStyle(35, 0x9400D3, 1);
graphics3.moveTo(10, config.height/2-68);
graphics3.lineTo(10, config.height/2+68);
graphics3.stroke();
goalLine = this.add.image(30, config.height, 'line');
goalLine.displayWidth = 1;
goalLine.displayHeight = config.width;
this.physics.add.existing(goalLine);
goalLine.body.setImmovable(true);
goalLine.alpha=0

goalLine2 = this.add.image(config.width-30, 50, 'line');
goalLine2.displayWidth = 1;
goalLine2.displayHeight = config.width;
this.physics.add.existing(goalLine2);
goalLine2.body.setImmovable(true);
goalLine2.alpha=0



line = this.physics.add.staticImage(graphics2.generateTexture())
post.setBounce(1)
post.setImmovable(true)
post2.setBounce(1)
post2.setImmovable(true)

post3 = this.physics.add.image(20, config.height/2+80, 'wall');
post4 = this.physics.add.image(20, config.height/2-80, 'wall');


post3.setBounce(1)
post3.setImmovable(true)
post4.setBounce(1)
post4.setImmovable(true)

 ship1 = this.physics.add.image(700, 700, "observor");
 ship1.setScale(0.35);
 ship1.setCollideWorldBounds(true);
 ship1.setBounce(1);
 ship1.setDamping(2);
 ship1.setCircle(60)



 plasma = this.physics.add.image("plasma");
 


 



 // draw a circle on the graphics object




 ball = this.physics.add.image(config.width/2, config.height/2, "ball");
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
  this.physics.add.collider(ball, goalLine, respawnBall2, null, this);
  this.physics.add.collider(ball, goalLine2, respawnBall1, null, this);
 


    

  this.physics.add.collider(ball, topLine);
  this.physics.add.collider(ball, bottomLine);
  this.physics.add.collider(ball, rightLine);
  this.physics.add.collider(ball, inverse_leftLine);
  this.physics.add.collider(ball, inverse_leftLine2);

  this.physics.add.collider(ball, rightLine2);
  this.physics.collide(ship1, post);
  this.physics.collide(ship1, post2);
  this.physics.collide(post, ball);
  this.physics.collide(post2, ball);
  this.physics.collide(ship1, post3);
  this.physics.collide(ship1, post4);
  this.physics.collide(post3, ball);
  this.physics.collide(post4, ball);
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
  this.physics.add.collider(ball, goal, respawnBall1, null, this);
  //this.physics.add.collider(ball, goal2, respawnBall, null, this);
  this.physics.add.collider(ball, goal3, respawnBall2, null, this);
 

;
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

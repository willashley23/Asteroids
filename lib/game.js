const Asteroid = require('./asteroid.js');
const Ship = require('./ship.js');
const img = new Image();

function Game() {
  this.asteroids = [];
  this.addAsteroids();
  this.ship = new Ship({pos: this.randomPosition(), game: this});
  this.bullets = [];
}

Game.DIM_X = 800;
Game.DIM_Y = 605;
Game.NUM_ASTEROIDS = 5;


Game.prototype.draw = function(ctx, speed) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  img.onload = function () {
    ctx.drawImage(img, 0, 0)
  };
  img.src = 'space.png';
  let y = 0;
  let x = 0;
  // Moved the lets togther.
  y += speed;
  ctx.drawImage(img, x,y);
  ctx.drawImage(img, x, y - Game.DIM_Y);
  if (y >= Game.DIM_Y) {
      console.log("hello")
      y = 0;
  };
  this.allObjects().forEach( (asteroid) => {
    asteroid.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  this.allObjects().forEach( (asteroid) => {
    asteroid.move();
  });
};

Game.prototype.wrap = function(pos) {
  let newX = pos[0];
  let newY = pos[1];
  if (newX > Game.DIM_X + 50) {
    newX = 0;
  }
  if (newY > Game.DIM_Y + 50) {
    newY = 0;
  }
  if (newX < 0) {
    newX = Game.DIM_X;
  }
  if (newY < 0) {
    newY = Game.DIM_Y;
  }
  return [newX, newY];
};


Game.prototype.addAsteroids = function() {
  for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
    let x = Math.floor(Math.random() * 500 );
    let y = Math.floor(Math.random() * 500);
    let asteroid = new Asteroid({game: this, pos: [x, y]});
    this.asteroids.push(asteroid);
  }
};


Game.prototype.checkCollisions = function () {
  this.allObjects().forEach( (asteroid1) => {
    this.allObjects().forEach( (asteroid2) => {
      if (asteroid1.isCollidedWith(asteroid2) && asteroid1 !== asteroid2) {
        asteroid1.collideWith(asteroid2);
      }
    });
  });
};

Game.prototype.removeAsteroid = function (asteroid) {
  let idx = this.asteroids.indexOf(asteroid);
  if (idx > -1) {
    this.asteroids.splice(idx, 1);
  }
};

Game.prototype.step = function () {
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.allObjects = function () {
  return this.asteroids.concat([this.ship]).concat(this.bullets);
};


Game.prototype.randomPosition = function () {
  let x = Math.floor(Math.random() * Game.DIM_X);
  let y = Math.floor(Math.random() * Game.DIM_Y);
  return [x,y];
};


module.exports = Game;

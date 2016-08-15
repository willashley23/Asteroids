const Asteroid = require('./asteroid.js');

function Game() {
  this.asteroids = [];
  this.addAsteroids();
}

Game.DIM_X = 800;
Game.DIM_Y = 800;
Game.NUM_ASTEROIDS = 5;

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.asteroids.forEach( (asteroid) => {
    asteroid.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  this.asteroids.forEach( (asteroid) => {
    asteroid.move();
  });
};

Game.prototype.wrap = function(pos) {
  let newX = pos[0];
  let newY = pos[1];
  if (newX > Game.DIM_X+ 50) {
    newX = 0;
  }
  if (newY > Game.DIM_Y + 50) {
    newY = 0;
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
  this.asteroids.forEach( (asteroid1) => {
    this.asteroids.forEach( (asteroid2) => {
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


module.exports = Game;

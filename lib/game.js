const Asteroid = require('./asteroid.js');

function Game() {
  this.asteroids = [];
  this.addAsteroids();
}

Game.DIM_X = 500;
Game.DIM_Y = 500;
Game.NUM_ASTEROIDS = 5;

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, 500, 500);
  this.asteroids.forEach( (asteroid) => {
    asteroid.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  this.asteroids.forEach( (asteroid) => {
    asteroid.move();
  });
};

Game.prototype.addAsteroids = function() {
  for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
    let x = Math.floor(Math.random() * 500 );
    let y = Math.floor(Math.random() * 500);
    let asteroid = new Asteroid({pos: [x, y]});
    this.asteroids.push(asteroid);
  }
};

module.exports = Game;

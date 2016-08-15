const Asteroid = require('./asteroid.js');

function Game() {
  this.asteroids = [];
  this.addAsteroids();
}

Game.DIM_X = 100;
Game.DIM_Y = 100;
Game.NUM_ASTEROIDS = 5;

Game.prototype.draw = function(ctx) {
  ctx.clearRect();
  this.asteroids.forEach( (asteroid) => {
    asteroid.draw();
  });
};

Game.prototype.moveObjects = function () {
  this.asteroids.forEach( (asteroid) => {
    asteroid.move();
  });
};

Game.prototype.addAsteroids = function() {
  for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
    let x = Math.floor(Math.random() * 10 );
    let y = Math.floor(Math.random() * 10 );
    let asteroid = new Asteroid({pos: [x, y]});
    this.asteroids.push(asteroid);
  }
};

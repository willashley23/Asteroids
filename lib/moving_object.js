const Game = require('./game');

function MovingObject(options) {
  this.game = options['game'];
  this.pos = options['pos'];
  this.vel = options['vel'];
  this.radius = options['radius'];
  this.color = options['color'];
}


MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );
  ctx.fill();
};


MovingObject.prototype.move = function () {
  this.pos = this.game.wrap(this.pos);
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
};

//Dist([x_1, y_1], [x_2, y_2]) = sqrt((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2)
MovingObject.prototype.isCollidedWith = function(otherObject) {
  let dist = Math.sqrt(
    Math.pow((this.pos[0]-otherObject.pos[0]),2) + Math.pow(
      (this.pos[1]-otherObject.pos[1]),2));
  let radii = this.radius + otherObject.radius;
  return dist < radii;
};

MovingObject.prototype.collideWith = function(otherObject) {
  this.game.removeAsteroid(this);
  this.game.removeAsteroid(otherObject);
};


module.exports = MovingObject;

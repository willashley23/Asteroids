// const Game = require('./game');

function MovingObject(options) {
  this.game = options['game'];
  this.pos = options['pos'];
  this.vel = options['vel'];
  this.radius = options['radius'];
  this.isWrappable = options['wrappable'];
  this.type = options['type'];
  this.angle = options['angle'];
  this.justSpawned = options['justSpawned'];
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
  if (this.isWrappable) {
    this.pos = this.game.wrap(this.pos);
  }
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  let dist = Math.sqrt(
    Math.pow((this.pos[0]-otherObject.pos[0]),2) + Math.pow(
      (this.pos[1]-otherObject.pos[1]),2));
  let radii = this.radius + otherObject.radius;
  return dist < radii;
};

MovingObject.prototype.collideWith = function(otherObject) {

};

module.exports = MovingObject;

const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Bullet = require('./bullet.js');

function Ship(posOptions) {
  let options = {game: posOptions['game'], color: 'green', pos: posOptions['pos'], radius: 20, vel: [0,0], wrappable: true}
  MovingObject.call(this, options);
  this.faceingDir = [0,0];
}

Utils.inherits(Ship, MovingObject);

Ship.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0,0];
};

Ship.prototype.power = function (impulse) {
  console.log(this.vel);
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

Ship.prototype.fireBullet = function () {
  let bulletVel = [this.vel[0] + 2, this.vel[1] + 5];
  let bullet = new Bullet({pos: this.pos, vel: bulletVel, game: this.game});
  this.game.bullets.push(bullet);
};

Ship.prototype.move = function () {
  if (this.isWrappable) {
    this.pos = this.game.wrap(this.pos);
  }
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
  this.vel[0] *= .98;
  this.vel[1] *= .98;
};

module.exports = Ship;

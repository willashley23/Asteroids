const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Bullet = require('./bullet.js');

function Ship(posOptions) {
  let options = {game: posOptions['game'], color: 'green', pos: posOptions['pos'], radius: 20, vel: [0,0], wrappable: true, type: 0}
  MovingObject.call(this, options);
  this.facingDir = 0;
  this.H = window.innerHeight; //*0.75,
  this.W = window.innerWidth; //*0.75;
  this.xc = this.W/2; //zeby bylo w centrum :v
  this.yc = this.H/2; //jw.
  this.x =  this.xc;
  this.y =  this.yc;
  this.dv = 0.2;
  this.dt = 1;
  this.vx = 0;
  this.vy = 0;
  this.maxVel = 10;
}

Utils.inherits(Ship, MovingObject);

Ship.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0,0];
};


Ship.prototype.fireBullet = function () {
  let bulletVel = [(this.vel[0] * 4), (this.vel[1] * 5) - 10];
  let bullet = new Bullet({pos: this.pos, vel: bulletVel, game: this.game});
  this.game.bullets.push(bullet);
};

  
Ship.prototype.power = function (impulse) {
  if (impulse[0] === -2 && this.facingDir !== Math.PI) {
    this.facingDir <= Math.PI ? this.facingDir += 30 / 180 * Math.PI : this.facingDir -= 30 / 180 * Math.PI;
  }
  if (impulse[0] === 2 && this.facingDir !== 0) {
    this.facingDir <= 0 ? this.facingDir += 30 / 180 * Math.PI : this.facingDir -= 30 / 180 * Math.PI;
  }
  if (impulse[1] === 2 && this.facingDir !== (Math.PI / 2 * 3)) {
    this.facingDir <= (3 * Math.PI / 2) ? this.facingDir += 30 / 180 * Math.PI : this.facingDir -= 30 / 180 * Math.PI;
  }
  if (impulse[1] === -2 && this.facingDir !== (Math.PI / 2)) {
    this.facingDir <= (Math.PI / 2) ? this.facingDir += 30 / 180 * Math.PI : this.facingDir -= 30 / 180 * Math.PI;
  }
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
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

Ship.prototype.convertToRadians = function(degree) {
  return degree*(Math.PI/180);
}

Ship.prototype.draw = function (ctx) {
  const img = new Image();
  img.onload = function () {
    ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius)
  };
  img.src = 'galaga_ship.png';
  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
  // var x = 800 / 2;
  // var y = Math.floor(605 / 2);
  // var width = img.width;
  // var height = img.height;
  // ctx.save();
  // ctx.translate(this.x,this.y);
  // ctx.translate(25,25);
  // ctx.rotate(this.facingDir);
  // ctx.translate(-7,-10);
  // ctx.restore();
};

module.exports = Ship;

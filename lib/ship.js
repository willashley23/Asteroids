const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Bullet = require('./bullet.js');

function Ship(posOptions) {
  let options = {game: posOptions['game'], color: 'green', pos: posOptions['pos'], radius: 20, vel: [0,0], wrappable: true, type: 0, angle: 0}
  MovingObject.call(this, options);
  this.facingDir = 0;
}

Utils.inherits(Ship, MovingObject);

Ship.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0,0];
};


Ship.prototype.fireBullet = function () {
  let bulletVel = [0,0]
  if (this.facingDir > 1.4 && this.facingDir < 2) {
    //90 deg angle
    bulletVel = [10,0]
  } else if (this.facingDir < 0) {
    bulletVel = [-10,0]
  } else if (this.facingDir > 2) {
    bulletVel = [0,10]
  } else {
    bulletVel = [0,-10]
  }
  let bullet = new Bullet({pos: this.pos, vel: bulletVel, game: this.game, angle: this.facingDir});
  this.game.bullets.push(bullet);
};

  
Ship.prototype.power = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];

  let dest = [(this.pos[0]+impulse[0]),[(this.pos[1]+impulse[1])]];
  let targetX = dest[0];
  let targetY = dest[1];
  var tx = targetX - this.pos[0]
  var ty = targetY - this.pos[1]
  let dist = Math.sqrt(tx * tx + ty * ty);
  var radians = Math.atan2(-tx,-ty) * -1;
  this.facingDir = radians;
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

Ship.prototype.rotateAndCache = function(image,angle) {
  var offscreenCanvas = document.createElement('canvas');
  var offscreenCtx = offscreenCanvas.getContext('2d');

  var size = Math.max(image.width, image.height);
  offscreenCanvas.width = size;
  offscreenCanvas.height = size;

  offscreenCtx.translate(size/2, size/2);
  offscreenCtx.rotate(angle);
  offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));

  return offscreenCanvas;
}

Ship.prototype.draw = function (ctx) {
  const img = new Image();
  let that = this
  img.onload = function () {
    if(!that.game.lose()) {
      ctx.drawImage(img, 0, 0)
    } 
  };
  img.src = 'galaga_ship.png';
  let rotatedShip = this.rotateAndCache(img,this.facingDir)
  ctx.drawImage(rotatedShip, this.pos[0]-this.radius, this.pos[1]-this.radius);

};

module.exports = Ship;

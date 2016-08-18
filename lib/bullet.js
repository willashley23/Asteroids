
const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');

function Bullet(posOptions) {
  let options = {game: posOptions['game'], color: 'red', pos: posOptions['pos'], radius: 5, vel: posOptions['vel'], wrappable: false, type: 0, angle: posOptions['angle']}
  MovingObject.call(this, options);
}
Utils.inherits(Bullet, MovingObject);


Bullet.prototype.rotateAndCache = function(image, angle) {
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

Bullet.prototype.draw = function (ctx) {
  const img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0,  0)
  };
  img.src = 'laser.png';
  let rotatedLaser = this.rotateAndCache(img,this.angle)
  ctx.drawImage(rotatedLaser, this.pos[0]-this.radius, this.pos[1]-this.radius)
};

module.exports = Bullet;

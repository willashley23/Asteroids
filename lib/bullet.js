const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');

function Bullet(posOptions) {
  let options = { 
    game: posOptions['game'], 
    pos: posOptions['pos'], 
    vel: posOptions['vel'], 
    angle: posOptions['angle'],  
    radius: 5, 
    wrappable: false, 
    type: 0,
    hasPowerup: false
  }
  MovingObject.call(this, options);
}
Utils.inherits(Bullet, MovingObject);

Bullet.prototype.draw = function (ctx) {
  const img = new Image();
  let that = this;
  img.onload = function () {
    if(!that.game.lose() && !that.game.win()) {
      ctx.drawImage(img, 0, 0)
    } 
  };
  img.src = 'images/laser.png';
  let rotatedLaser = Utils.rotateAndCache(img, this.angle)
  ctx.drawImage(rotatedLaser, this.pos[0]-this.radius, this.pos[1]-this.radius)
};

module.exports = Bullet;

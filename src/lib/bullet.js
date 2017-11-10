import Utils from './utils';
import MovingObject from './moving_object';

class Bullet extends MovingObject {
    constructor(posOptions) {
        super(posOptions);
        this.radius = 5;
        this.isWrappable = false;
        this.type = 0;
        this.hasPowerup = false;
    }
}


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

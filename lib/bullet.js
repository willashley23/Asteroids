
const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');

function Bullet(posOptions) {
  let options = {game: posOptions['game'], color: 'red', pos: posOptions['pos'], radius: 5, vel: posOptions['vel'], wrappable: false, type: 0}
  MovingObject.call(this, options);
}
Utils.inherits(Bullet, MovingObject);


Bullet.prototype.draw = function (ctx) {
  const img = new Image();
  img.onload = function () {
    ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius)
  };
  img.src = 'laser.png';
  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
  //These need to rotate too
};

module.exports = Bullet;

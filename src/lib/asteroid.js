import Utils from './utils';
import MovingObject from './moving_object';
import Ship from './ship';
import Bullet from './bullet';

class Asteroid extends MovingObject {
  constructor(posOptions) {
      super(posOptions);
      this.angle = 0;
      this.hasPowerup = false;
      this.isWrappable = true;
      this.type = Utils.randomNum();
      this.vel = Utils.randomVec(posOptions['game'.difficultySetting]);
  }
}


Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject instanceof Ship && !otherObject.invulnerable) {
    if (otherObject.hasPowerup) {
      otherObject.hasPowerup = false
      this.game.removeAsteroid(this);
    } else {
      otherObject.relocate();
      new Audio('sounds/hit.wav').play();
      this.game.decreaseLives();
    }
  } else if (otherObject instanceof Bullet) {
    if (this.radius === 30 && Utils.fragmentChance(this.game.difficultySetting) === 1) {
      this.game.removeBullet(otherObject);
      let currPos = this.pos
      this.game.addAsteroids(true, [this.pos[0],this.pos[1]]);
		  this.game.removeAsteroid(this);
    } else {
      this.game.removeBullet(otherObject);
      this.game.removeAsteroid(this);
    } if (this.radius === 30) {
        new Audio('sounds/explosion.wav').play();
      } else {
        new Audio('sounds/explosionsmall.wav').play();
      }
	}
};
  
Asteroid.prototype.draw = function (ctx) {
  if (this.type === 1) {
  const img = new Image();
  let that = this
   img.onload = function () {
    if(!that.game.lose() && !that.game.win()) {
      ctx.drawImage(img, 0, 0)
    } 
  };
    if (this.radius === 15) {
      img.src = 'images/smallasteroid1.png';
    } else {
      img.src = 'images/asteroid1.png'
    }
  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
  } else {
    const img = new Image();
    let that = this
   img.onload = function () {
    if(!that.game.lose() && !that.game.win()) {
      ctx.drawImage(img, 0, 0)
    } 
  };
   if (this.radius === 15) {
    img.src = 'images/smallasteroid2.png'
   } else {
    img.src = 'images/asteroid2.png';
   }
  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
  }
};

module.exports = Asteroid;

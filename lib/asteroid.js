const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Ship = require('./ship.js');
const Bullet = require('./bullet.js');


function Asteroid(posOptions) {
  let options = {
    game: posOptions['game'], 
    pos: posOptions['pos'], 
    radius: posOptions['radius'], 
    justSpawned: posOptions['justSpawned'],
    vel: Utils.randomVec(posOptions['game'].difficultySetting), 
    wrappable: true, 
    type: Utils.randomNum(), 
    angle: 0,
    hasPowerup: false
  }
  MovingObject.call(this, options);
}

Utils.inherits(Asteroid, MovingObject);


Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject instanceof Ship) {
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
      currPos = this.pos
      this.game.addAsteroids(true, [this.pos[0],this.pos[1]]);
		  this.game.removeAsteroid(this);
    } else {
      this.game.removeAsteroid(this);
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

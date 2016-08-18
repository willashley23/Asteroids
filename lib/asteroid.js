
const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Ship = require('./ship.js');
const Bullet = require('./bullet.js');

function Asteroid(posOptions) {
  let options = {game: posOptions['game'], color: 'brown', pos: posOptions['pos'], radius: posOptions['radius'], vel: Utils.randomVec(), wrappable: true, type: Utils.randomNum(), angle: 0, justSpawned: posOptions['justSpawned']
}
  MovingObject.call(this, options);
}
Utils.inherits(Asteroid, MovingObject);


Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject instanceof Ship) {
    otherObject.relocate();
    //decrease lives here
  } else if (otherObject instanceof Bullet) {
    if (this.radius === 30) {
      currPos = this.pos
      this.game.addAsteroids(true, [this.pos[0],this.pos[1]]);
		  this.game.removeAsteroid(this);
    } else if (!this.justSpawned) {
      console.log("removed")
      this.game.removeAsteroid(this);
    }
    else {
      this.justSpawned = false;
    }
	}
};


  
Asteroid.prototype.draw = function (ctx) {
  if (this.type === 1) {
  const img = new Image();
   img.onload = function () {
    ctx.drawImage(img, 0, 0)
  };
    if (this.radius === 15) {
      img.src = 'smallasteroid1.png';
    } else {
      img.src = 'asteroid1.png'
    }
  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
  } else {
    const img = new Image();
   img.onload = function () {
    ctx.drawImage(img, 0, 0)
  };
   if (this.radius === 15) {
    img.src = 'smallasteroid2.png'
   } else {
    img.src = 'asteroid2.png';
   }
  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
  }
};

module.exports = Asteroid;


const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Ship = require('./ship.js');
const Bullet = require('./bullet.js');

function Asteroid(posOptions) {
  let options = {game: posOptions['game'], color: 'brown', pos: posOptions['pos'], radius: posOptions['radius'], vel: Utils.randomVec(), wrappable: true, type: Utils.randomNum(), angle: 0
}
  MovingObject.call(this, options);
}
Utils.inherits(Asteroid, MovingObject);


Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject instanceof Ship) {
    otherObject.relocate();
    //decrese lives here
  } else if (otherObject instanceof Bullet) {
    if (this.radius === 30) {
      currPos = this.pos
      this.game.addAsteroids(true);
		  this.game.removeAsteroid(this);
    } else {
      this.game.removeAsteroid(this);
    }
    //check this.asteriod radius to see if it can collapse smaller or just remove
    //spwan smaller asteroids here, call game.addAsteroid
    //try changing radius here? if not, will need to add radius to posOptions.
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

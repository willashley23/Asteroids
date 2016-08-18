
const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Ship = require('./ship.js');
const Bullet = require('./bullet.js');

function Asteroid(posOptions) {
  let options = {game: posOptions['game'], color: 'brown', pos: posOptions['pos'], radius: 30, vel: Utils.randomVec(), wrappable: true, type: Utils.randomNum(), angle: 0
}
  MovingObject.call(this, options);
}
Utils.inherits(Asteroid, MovingObject);


Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject instanceof Ship) {
    otherObject.relocate();
  } else if (otherObject instanceof Bullet) {
		this.game.removeAsteroid(this);
	}
};


  
Asteroid.prototype.draw = function (ctx) {
  if (this.type === 1) {
  const img = new Image();
   img.onload = function () {
    ctx.drawImage(img, 0, 0)
  };
    img.src = 'asteroid1.png';
  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
  } else {
    const img = new Image();
   img.onload = function () {
    ctx.drawImage(img, 0, 0)
  };
    img.src = 'asteroid2.png';
  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
  }
};

module.exports = Asteroid;

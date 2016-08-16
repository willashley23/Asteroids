
const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Ship = require('./ship.js');
const Bullet = require('./bullet.js');

function Asteroid(posOptions) {
  let options = {game: posOptions['game'], color: 'brown', pos: posOptions['pos'], radius: 30, vel: Utils.randomVec(), wrappable: true}
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

module.exports = Asteroid;

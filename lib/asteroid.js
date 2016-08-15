
const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Ship = require('./ship.js');
console.log(Ship);
function Asteroid(posOptions) {
  let options = {game: posOptions['game'], color: 'brown', pos: posOptions['pos'], radius: 30, vel: Utils.randomVec()}
  MovingObject.call(this, options);
}
Utils.inherits(Asteroid, MovingObject);


Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject instanceof Ship) {
    otherObject.relocate();
  }
};

module.exports = Asteroid;

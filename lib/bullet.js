
const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');
// const Asteroid = require('./asteroid.js');

function Bullet(posOptions) {
  let options = {game: posOptions['game'], color: 'red', pos: posOptions['pos'], radius: 10, vel: posOptions['vel'], wrappable: false}
  MovingObject.call(this, options);
}
Utils.inherits(Bullet, MovingObject);
console.log(Bullet);
console.log(MovingObject);
// console.log(Asteroid);

Bullet.prototype.collideWith = function(otherObject) {
  // debugger;
  // if (otherObject instanceof Asteroid) {
  //   this.game.removeAsteroid(otherObject);
  // }
};



module.exports = Bullet;

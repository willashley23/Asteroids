
const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');

function Bullet(posOptions) {
  let options = {game: posOptions['game'], color: 'red', pos: posOptions['pos'], radius: 5, vel: posOptions['vel'], wrappable: false}
  MovingObject.call(this, options);
}
Utils.inherits(Bullet, MovingObject);
console.log(Bullet);
console.log(MovingObject);


module.exports = Bullet;

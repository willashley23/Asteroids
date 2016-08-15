
const Util = require('./util.js');
const MovingObject = require('./moving_object.js');

function Asteroid(posOptions) {
  let options = {color: '#f4a460', pos: posOptions['pos'], radius: 2, vel: Util.randomVec}
  MovingObject.call(this, options);
}

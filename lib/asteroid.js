
const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');

function Asteroid(posOptions) {
  let options = {color: 'brown', pos: posOptions['pos'], radius: 30, vel: Utils.randomVec()}
  MovingObject.call(this, options);
}

Utils.inherits(Asteroid, MovingObject);

//inherit

module.exports = Asteroid;

const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');

function Ship(posOptions) {
  let options = {game: posOptions['game'], color: 'green', pos: posOptions['pos'], radius: 20, vel: [0,0]}
  MovingObject.call(this, options);
}

Utils.inherits(Ship, MovingObject);

Ship.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0,0];
};



module.exports = Ship;

const Utils = require('./utils.js');
const MovingObject = require('./moving_object.js');

function PowerUp(posOptions) {
  let options = {
    game: posOptions['game'], 
    radius: 15, 
    justSpawned: false,
    vel: Utils.randomVec(), 
    pos: Utils.randomPos(), 
    type: Utils.randomNum(), 
    wrappable: true, 
    angle: 0,
    hasPowerup: false
  }
  this.powerupType = Math.floor(Math.random() * 2) + 1;
  MovingObject.call(this, options);
}

Utils.inherits(PowerUp, MovingObject);

PowerUp.prototype.randomPowerup = function() {
  let chance = Math.floor(Math.random() * 320)
  if (chance === 5 && this.game.powerups < 1) {
    this.game.powerups += 1;
    return true
  } else {
    return false;
  }
}

PowerUp.prototype.draw = function (ctx) {
  const powerup = new Image();
  let that = this
  powerup.onload = function () {
    if(!that.game.lose() && !that.game.win()) {
      ctx.drawImage(powerup, 0, 0)
    } 
  };
  if (this.powerupType === 1) {
    powerup.src = 'images/powerup.png'
  } else {
    powerup.src = 'images/tripleshot.png'
  }
  if (this.game.powerups > 0 || this.randomPowerup()) { 
    ctx.drawImage(powerup, this.pos[0]-this.radius, this.pos[1]-this.radius);
  }
};

module.exports = PowerUp;
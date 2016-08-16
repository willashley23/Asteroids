/* globals key */
const Game = require('./game.js');

// const KeyMaster = require('./keymaster.js');


function GameView(ctx) {
  this.ctx = ctx;
  this.game = new Game();
}

GameView.prototype.start = function () {
  this.bindKeyHandlers();
  const animate = () => {
    this.game.step();
    this.game.draw(this.ctx);
    requestAnimationFrame(animate);
  };
  animate();
};

GameView.prototype.bindKeyHandlers = function() {
  key('right', () => {
    this.game.ship.power([1, 0]);
  });
  key('left', () => {
    this.game.ship.power([-1, 0]);
  });
  key('down', () => {
    this.game.ship.power([0, 1]);
  });
  key('up', () => {
    this.game.ship.power([0, -1]);
  });
  key('space', () => {
    this.game.ship.fireBullet();
  });
};


module.exports = GameView;

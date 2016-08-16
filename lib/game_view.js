/* globals key */
const Game = require('./game.js');



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
  key('d', () => {
    this.game.ship.power([.5, 0]);
  });
  key('a', () => {
    this.game.ship.power([-.5, 0]);
  });
  key('s', () => {
    this.game.ship.power([0, .5]);
  });
  key('w', () => {
    this.game.ship.power([0, -.5]);
  });
  key('l', () => {
    this.game.ship.fireBullet();
  });
};


module.exports = GameView;

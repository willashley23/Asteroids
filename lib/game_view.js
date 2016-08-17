/* globals key */
const Game = require('./game.js');
let speed = 1;


function GameView(ctx) {
  this.ctx = ctx;
  this.game = new Game();
}

GameView.prototype.start = function () {
  this.bindKeyHandlers();
  const animate = () => {
    speed += 1;
    if (speed >= 605) {
      speed = 0;
    };
    this.game.step();
    this.game.draw(this.ctx, speed);
    requestAnimationFrame(animate);
  };
  animate();
};

GameView.prototype.bindKeyHandlers = function() {
  key('d', () => {
    this.game.ship.power([2, 0]);
  });
  key('a', () => {
    this.game.ship.power([-2, 0]);
  });
  key('s', () => {
    this.game.ship.power([0, 2]);
  });
  key('w', () => {
    this.game.ship.power([0, -2]);
  });
  key('l', () => {
    this.game.ship.fireBullet();
  });
};


module.exports = GameView;

const Game = require('./game.js');

function GameView(ctx) {
  this.ctx = ctx;
  this.game = new Game();
}

GameView.prototype.start = function () {
  // window.setInterval(() => {
  //   this.game.moveObjects();
  //   this.game.draw(this.ctx);
  // }, 20);

  const animate = () => {
    this.game.moveObjects();
    this.game.draw(this.ctx);
    requestAnimationFrame(animate);
  };
  animate();
};

module.exports = GameView;

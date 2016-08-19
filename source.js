const GameView = require('./lib/game_view.js');

document.addEventListener("DOMContentLoaded", () => {
  let canvasEl = document.getElementById('game-canvas');
  let ctx = canvasEl.getContext('2d');
  let gameView = new GameView(ctx);
  gameView.start();
});

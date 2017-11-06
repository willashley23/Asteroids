const GameView = require('./lib/game_view.js');
const Animal = require('./lib/tc.js');

document.addEventListener("DOMContentLoaded", () => {
  console.log('ff')
  window.Animal = Animal;
  let canvasEl = document.getElementById('game-canvas');
  let ctx = canvasEl.getContext('2d');
  let gameView = new GameView(ctx);
  gameView.start();
});

/* globals key */
const Game = require('./game.js');
let speed = 1;


function GameView(ctx) {
  this.ctx = ctx;
  this.game = new Game();
}

GameView.prototype.start = function (callback) {
  this.bindKeyHandlers();
  this.animate(0);
};

GameView.prototype.animate = function(time) {
    speed += 1;
    if (speed >= 605) {
      speed = 0;
    };
    this.game.step();
    this.game.draw(this.ctx, speed);
    if(!this.game.lose()){
      requestAnimationFrame(this.animate.bind(this));
    }
    else {
    this.ctx.fillStyle = "white";
    this.ctx.font = "italic "+24+"pt Arial ";
    this.ctx.fillText(`Game Over \n Press Enter to restart`, 100,200 );
      key('enter', ()=>{
        this.game = new Game();
        this.start();
      });
    }
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

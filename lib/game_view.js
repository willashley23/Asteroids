/* globals key */
const Game = require('./game.js');
const img = new Image();
const DIM_X = 800;
const DIM_Y = 605;
let speed = 1;


function GameView(ctx) {
  this.ctx = ctx;
  this.game = new Game();
  this.onHomeScreen = true;
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

  if (this.onHomeScreen) {

    let that = this;
    img.onload = function () {
      that.ctx.drawImage(img, 0, 0)
    };
    
    img.src = 'space.png';
    let y = 0;
    let x = 0;
    y += speed;
    this.ctx.drawImage(img, x,y);
    this.ctx.drawImage(img, x, y - DIM_Y);

    if (y >= DIM_Y) {
      y = 0;
    };

    // this.ctx.fillStyle = "white";
    // this.ctx.font = 64+"px Arial";
    // this.ctx.fillText('ASTEROIDS', 100, 200);
    requestAnimationFrame(this.animate.bind(this));
    key('enter', ()=> {
      this.onHomeScreen = false;
      // this.game = new Game();
      // this.start();
      document.getElementById('game-header').style.display="none";
    });
  } else {
    this.game.step();
    this.game.draw(this.ctx, speed);
    if(!this.game.lose() && !this.game.win()){
      requestAnimationFrame(this.animate.bind(this));
    }
    else {
    this.ctx.fillStyle = "white";
    this.ctx.font = "italic "+24+"pt 8bit_wonder";
    that = this;
      if(this.game.win()){
        that.ctx.fillText(`You Win! \n Press Enter to restart`, 100, 200);
      } else {
        console.log(speed)
        that.ctx.fillText(`Game Over \n Press Enter to restart`, 100, 200);
      }
      key('enter', ()=>{
        this.game = new Game();
        this.start();
      });
    }
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

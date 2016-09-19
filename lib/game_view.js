/* globals key */
const Game = require('./game.js');
const Utils = require('./utils.js');
const img = new Image();
const DIM_X = 800;
const DIM_Y = 605;
let speed = 1;
let difficultySetting = "easy"


function GameView(ctx) {
  this.ctx = ctx;
  this.game = new Game("easy");
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
    
    img.src = 'images/space.png';
    let y = 0;
    let x = 0;
    y += speed;
    this.ctx.drawImage(img, x,y);
    this.ctx.drawImage(img, x, y - DIM_Y);

    if (y >= DIM_Y) {
      y = 0;
    };

    requestAnimationFrame(this.animate.bind(this));
    key('enter', ()=> {
      this.onHomeScreen = false;
      Utils.hideHomeScreen(); 
    });

    key('1', () => {
      this.onHomeScreen = false;
      Utils.hideHomeScreen();
    });

    key('2', () => {
      this.onHomeScreen = false;
      Utils.hideHomeScreen();
      this.game = new Game("medium");
    });

    key('3', () => {
      this.onHomeScreen = false;
      Utils.hideHomeScreen();
      this.game = new Game("hard");
    });

    key('4', () => {
      this.onHomeScreen = false;
      Utils.hideHomeScreen();
      this.game = new Game("endless");
    });
  } else {
    this.game.step();
    this.game.draw(this.ctx, speed);
    if(!this.game.lose() && !this.game.win()){
      requestAnimationFrame(this.animate.bind(this));
    }
    else {
    this.ctx.fillStyle = "white";
    this.ctx.font = "italic "+24+"pt Arial";
    that = this;
      if(this.game.win()){
        document.getElementById('game-header').innerHTML = "You Win";
        document.getElementById('game-header').style.left = "235px";
        Utils.revealHTML();
        new Audio('sounds/victory.wav').play();
      } else {
        document.getElementById('game-header').innerHTML = "GAME OVER";
        Utils.revealHTML();
        new Audio('sounds/loss.wav').play();
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
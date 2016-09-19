/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);

	document.addEventListener("DOMContentLoaded", () => {
	  let canvasEl = document.getElementById('game-canvas');
	  let ctx = canvasEl.getContext('2d');
	  let gameView = new GameView(ctx);
	  gameView.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* globals key */
	const Game = __webpack_require__(2);
	const Utils = __webpack_require__(4);
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(3);
	const Ship = __webpack_require__(6);
	const PowerUp = __webpack_require__(8);
	const img = new Image();
	const heart = new Image();

	function Game(difficulty) {
	  this.difficultySetting = difficulty;
	  this.setAsteroidCount(this.difficultySetting);
	  this.asteroids = [];
	  this.addAsteroids();
	  this.ship = new Ship({pos: this.randomPosition(), game: this});
	  this.powerup = new PowerUp({game: this});
	  this.bullets = [];
	  this.lives = 3;
	  this.powerups = 0;
	  this.powerupsArr = [this.powerup];
	  // Start game with 2 seconds of invulnerability
	}
	Game.DIM_X = 800;
	Game.DIM_Y = 605;
	Game.NUM_ASTEROIDS = 5;

	Game.prototype.setAsteroidCount = function (difficulty) {
	  switch (difficulty) {
	    case "easy":
	      Game.NUM_ASTEROIDS = 5;
	      break;

	    case "medium": 
	      Game.NUM_ASTEROIDS = 7;
	      break;

	    case "hard":
	      Game.NUM_ASTEROIDS = 10;
	      break;

	    default:
	      Game.NUM_ASTEROIDS = 5;
	  }
	}

	Game.prototype.draw = function(ctx, speed) {
	  
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  let that = this;
	  img.onload = function () {
	    if(!that.lose() && !that.win()) {
	      ctx.drawImage(img, 0, 0)
	    } 
	  };
	  heart.onload = function () {
	    if(!that.lose() && !that.win()) {
	      ctx.drawImage(heart, 0, 0);
	    }
	  }
	  heart.src = 'images/heart.png';
	  img.src = 'images/space.png';
	  let y = 0;
	  let x = 0;
	  let heartPos = 0;
	  y += speed;
	  ctx.drawImage(img, x,y);
	  ctx.drawImage(img, x, y - Game.DIM_Y);

	  for (var i = this.lives-1; i >= 0; i--) {
	    ctx.drawImage(heart, heartPos, 0);
	    heartPos += 40
	  }

	  if (y >= Game.DIM_Y) {
	      y = 0;
	  };
	  this.allObjects().forEach( (object) => {
	    object.draw(ctx);
	  });
	};

	Game.prototype.moveObjects = function () {
	  this.allObjects().forEach( (asteroid) => {
	    asteroid.move();
	  });
	};

	Game.prototype.wrap = function(pos) {
	  let newX = pos[0];
	  let newY = pos[1];
	  if (newX > Game.DIM_X + 50) {
	    newX = 0;
	  }
	  if (newY > Game.DIM_Y + 50) {
	    newY = 0;
	  }
	  if (newX < 0) {
	    newX = Game.DIM_X;
	  }
	  if (newY < 0) {
	    newY = Game.DIM_Y;
	  }
	  return [newX, newY];
	};


	Game.prototype.decreaseLives = function() {
	  this.lives -= 1;
	}

	Game.prototype.lose = function() {
	  if (this.lives <= 0) {
	    return true;
	  } else {
	    return false;
	  };
	}

	Game.prototype.win = function() {
	  if (this.asteroids.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	Game.prototype.addAsteroids = function(fragment = null, respawnPos = null) {
	  if (fragment === null) {
	    for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
	      let x = Math.floor(Math.random() * 500);
	      let y = Math.floor(Math.random() * 500);
	      let asteroid = new Asteroid({game: this, pos: [x, y], radius: 30});
	      this.asteroids.push(asteroid);
	    } 
	  } else {
	      for (let i = 0; i < 3; i++) {
	        let x = respawnPos[0]; 
	        let y = respawnPos[1];
	        let asteroid = new Asteroid({game: this, pos: [x, y], radius: 15, justSpawned: true})
	        this.asteroids.push(asteroid)
	      }
	    }
	};

	Game.prototype.checkCollisions = function () {
	  this.allObjects().forEach( (object1) => {
	    this.allObjects().forEach( (object2) => {
	      if (object1.isCollidedWith(object2) && object1 !== object2) {
	        object1.collideWith(object2);
	      }
	    });
	  });
	};

	Game.prototype.removeAsteroid = function (asteroid) {
	  let idx = this.asteroids.indexOf(asteroid);
	  if (idx > -1) {
	    this.asteroids.splice(idx, 1);
	  }
	};

	Game.prototype.removeBullet = function (bullet) {
	  let idx = this.bullets.indexOf(bullet);
	  if (idx > -1) {
	    this.bullets.splice(idx, 1);
	  }
	};

	Game.prototype.removePowerUp = function (powerUp) {
	  let idx = this.powerupsArr.indexOf(powerUp);
	  if (idx > -1) {
	    this.powerupsArr.splice(idx, 1);
	  }
	};

	Game.prototype.step = function () {
	  this.moveObjects();
	  this.checkCollisions();
	};


	Game.prototype.allObjects = function () {
	  return this.asteroids.concat([this.ship]).concat(this.bullets).concat(this.powerupsArr);
	};


	Game.prototype.randomPosition = function () {
	  let x = Math.floor(Math.random() * Game.DIM_X);
	  let y = Math.floor(Math.random() * Game.DIM_Y);
	  return [x,y];
	};


	module.exports = Game;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(4);
	const MovingObject = __webpack_require__(5);
	const Ship = __webpack_require__(6);
	const Bullet = __webpack_require__(7);


	function Asteroid(posOptions) {
	  let options = {
	    game: posOptions['game'], 
	    pos: posOptions['pos'], 
	    radius: posOptions['radius'], 
	    justSpawned: posOptions['justSpawned'],
	    vel: Utils.randomVec(posOptions['game'].difficultySetting), 
	    wrappable: true, 
	    type: Utils.randomNum(), 
	    angle: 0,
	    hasPowerup: false
	  }
	  MovingObject.call(this, options);
	}

	Utils.inherits(Asteroid, MovingObject);


	Asteroid.prototype.collideWith = function(otherObject) {
	console.log(this.game.safeSpawn)
	  if (otherObject instanceof Ship && !otherObject.invulnerable) {
	    if (otherObject.hasPowerup) {
	      otherObject.hasPowerup = false
	      this.game.removeAsteroid(this);
	    } else {
	      otherObject.relocate();
	      new Audio('sounds/hit.wav').play();
	      this.game.decreaseLives();
	    }
	  } else if (otherObject instanceof Bullet) {
	    if (this.radius === 30 && Utils.fragmentChance(this.game.difficultySetting) === 1) {
	      this.game.removeBullet(otherObject);
	      currPos = this.pos
	      this.game.addAsteroids(true, [this.pos[0],this.pos[1]]);
			  this.game.removeAsteroid(this);
	    } else {
	      this.game.removeBullet(otherObject);
	      this.game.removeAsteroid(this);
	    } if (this.radius === 30) {
	        new Audio('sounds/explosion.wav').play();
	      } else {
	        new Audio('sounds/explosionsmall.wav').play();
	      }
		}
	};
	  
	Asteroid.prototype.draw = function (ctx) {
	  if (this.type === 1) {
	  const img = new Image();
	  let that = this
	   img.onload = function () {
	    if(!that.game.lose() && !that.game.win()) {
	      ctx.drawImage(img, 0, 0)
	    } 
	  };
	    if (this.radius === 15) {
	      img.src = 'images/smallasteroid1.png';
	    } else {
	      img.src = 'images/asteroid1.png'
	    }
	  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
	  } else {
	    const img = new Image();
	    let that = this
	   img.onload = function () {
	    if(!that.game.lose() && !that.game.win()) {
	      ctx.drawImage(img, 0, 0)
	    } 
	  };
	   if (this.radius === 15) {
	    img.src = 'images/smallasteroid2.png'
	   } else {
	    img.src = 'images/asteroid2.png';
	   }
	  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
	  }
	};

	module.exports = Asteroid;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Util = {
	  inherits: function(childClass, parentClass) {
	    function Surrogate(){}
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate();
	    childClass.prototype.constructor = childClass;
	  },

	  randomVec: function(difficulty = "easy") {
	    let x;
	    let y;
	    if (difficulty === "hard") {
	      x = Math.floor(Math.random() * 4 ) + 1;
	      y = Math.floor(Math.random() * 4 ) + 1;
	    } else {
	      x = Math.floor(Math.random() * 2 ) + 1;
	      y = Math.floor(Math.random() * 2 ) + 1;
	    }
	    return [x,y];
	  },

	  randomPos: function() {
	    let x = Math.floor(Math.random() * 600 ) + 1
	    let y= Math.floor(Math.random() * 600 ) + 1
	    return [x,y];
	  },

	  randomNum: function() {
	    let num = Math.floor(Math.random() * 2) + 1
	    return num;
	  },

	  fragmentChance: function(difficulty = "easy") {
	    let num;
	    if (difficulty === "hard") {
	      num = Math.floor(Math.random() * 2) + 1
	    } else {
	     num = Math.floor(Math.random() * 3) + 1    
	    }
	    return num
	  },

	  rotateAndCache: function(image, angle) {
	    let offscreenCanvas = document.createElement('canvas');
	    let offscreenCtx = offscreenCanvas.getContext('2d');

	    let size = Math.max(image.width, image.height);
	    offscreenCanvas.width = size;
	    offscreenCanvas.height = size;

	    offscreenCtx.translate(size/2, size/2);
	    offscreenCtx.rotate(angle);
	    offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));

	    return offscreenCanvas;
	  },

	  hideHomeScreen: function() {
	    document.getElementById('game-header').style.display="none";
	    document.getElementById('wasd').style.display="none";
	    document.getElementById('difficulty').style.display="none";
	    document.getElementById('li1').style.display="none";
	    document.getElementById('li2').style.display="none";
	    document.getElementById('li3').style.display="none";
	    document.getElementById('controls').style.display="none";
	    document.getElementById('sub-controls').style.display="none";
	  },

	  revealHTML: function() {
	    document.getElementById('game-header').style.display = "block";
	    document.getElementById('game-end').style.display = "block";
	  }

	};

	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports) {

	// const Game = require('./game');

	function MovingObject(options) {
	  this.game = options['game'];
	  this.pos = options['pos'];
	  this.vel = options['vel'];
	  this.radius = options['radius'];
	  this.isWrappable = options['wrappable'];
	  this.type = options['type'];
	  this.angle = options['angle'];
	  this.justSpawned = options['justSpawned'];
	  this.hasPowerup = options['hasPowerup']
	}

	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );
	  ctx.fill();
	};

	MovingObject.prototype.move = function () {
	  if (this.isWrappable) {
	    this.pos = this.game.wrap(this.pos);
	  }
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	};

	MovingObject.prototype.isCollidedWith = function(otherObject) {
	  let dist = Math.sqrt(
	    Math.pow((this.pos[0]-otherObject.pos[0]),2) + Math.pow(
	      (this.pos[1]-otherObject.pos[1]),2));
	  let radii = this.radius + otherObject.radius;
	  return dist < radii;
	};

	MovingObject.prototype.collideWith = function(otherObject) {

	};

	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(4);
	const MovingObject = __webpack_require__(5);
	const Bullet = __webpack_require__(7);
	const PowerUp = __webpack_require__(8);

	function Ship(posOptions) {
	  let options = {
	    game: posOptions['game'], 
	    pos: posOptions['pos'],
	    radius: 20,
	    vel: [0,0],
	    wrappable: true,
	    type: 0,
	    angle: 0,
	    hasPowerup: false  
	  }
	  this.hasTripleShot = false;
	  this.currentNumBullets = 0;
	  this.invulnerable = false;
	  MovingObject.call(this, options);
	  this.facingDir = 0;
	}

	Utils.inherits(Ship, MovingObject);

	Ship.prototype.relocate = function () {
	  this.invulnerable = true
	  this.pos = this.game.randomPosition();
	  this.vel = [0,0];
	  let that = this;
	  window.setTimeout( function () {
	    that.invulnerable = false;
	  }, 1500);
	};

	Ship.prototype.collideWith = function(otherObject) {
	  if (otherObject instanceof PowerUp) {
	    if (otherObject.powerupType === 2) {
	      this.hasTripleShot = true;
	      this.currentNumBullets = this.game.bullets.length;
	      new Audio('sounds/tripleshot.wav').play();
	    } else {
	      this.hasPowerup = true;
	      new Audio('sounds/powerup.wav').play();
	    }
	    this.game.removePowerUp(otherObject);
	    this.game.powerups = 0;
	  } 
	};

	Ship.prototype.fireBullet = function () {
	  let bulletVel = [Math.sin(-this.facingDir)*-10, Math.cos(-this.facingDir)*-10]
	  if (this.hasTripleShot) {
	    let totalBullets = this.game.bullets.length;
	    let secondBulletPos;
	    let thirdBulletPos;
	    if (totalBullets - this.currentNumBullets > 80) {
	      this.hasTripleShot = false;
	    }
	    if (Math.abs(this.facingDir) > 3 || Math.round(this.facingDir) === 0) {
	      secondBulletPos = [this.pos[0]-30, this.pos[1]]
	      thirdBulletPos = [this.pos[0]+30, this.pos[1]]
	    } else {
	      secondBulletPos = [this.pos[0], this.pos[1]-30]
	      thirdBulletPos = [this.pos[0], this.pos[1]+30]
	    }
	    let bullet1 = new Bullet( {
	      pos: secondBulletPos, 
	      vel: bulletVel, 
	      game: this.game, 
	      angle: this.facingDir
	    });
	    let bullet2 = new Bullet( {
	      pos: thirdBulletPos, 
	      vel: bulletVel, 
	      game: this.game, 
	      angle: this.facingDir
	    });
	    this.game.bullets.push(bullet1);
	    this.game.bullets.push(bullet2);
	  }
	  let defaultBulletPos;
	  if (this.facingDir === 0) {
	    defaultBulletPos = [this.pos[0]-3.5, this.pos[1]-36]
	  } else if (this.facingDir > 3) {
	    defaultBulletPos = [this.pos[0]-3.5, this.pos[1]+36]
	    }
	  else {
	    defaultBulletPos = [this.pos[0], this.pos[1]-6]
	  }
	  let bullet3 = new Bullet( {
	    pos: defaultBulletPos, 
	    vel: bulletVel, 
	    game: this.game, 
	    angle: this.facingDir
	  });
	  this.game.bullets.push(bullet3);
	  new Audio('sounds/laser.wav').play();
	};

	Ship.prototype.power = function (impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	  let radians = Math.atan2(-this.vel[0], -this.vel[1]) * -1;
	  this.facingDir = radians;
	};

	Ship.prototype.move = function () {
	  if (this.isWrappable) {
	    this.pos = this.game.wrap(this.pos);
	  }
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  //Attenuate velocity over time
	  this.vel[0] *= .98;
	  this.vel[1] *= .98;
	};

	Ship.prototype.draw = function (ctx) {
	  const img = new Image();
	  const forceField = new Image();
	  let that = this
	  img.onload = function () {
	    if(!that.game.lose() && !that.game.win()) {
	      ctx.drawImage(img, 0, 0)
	    } 
	  };
	  forceField.onload = function() {
	    if(!that.game.lose() && !that.game.win()) {
	      ctx.drawImage(forceField, 0, 0)
	    }
	  };
	  forceField.src = 'images/forcefield.png';
	  img.src = 'images/galaga_ship.png';
	  let rotatedShip = Utils.rotateAndCache(img,this.facingDir)
	  // Blink sprite to indicate invulnerabiltiy 
	  if (!this.invulnerable || Math.floor(Date.now() / 60) % 2) {
	   ctx.drawImage(rotatedShip, this.pos[0]-this.radius, this.pos[1]-this.radius);
	  } 
	  if (this.hasPowerup) { 
	    ctx.drawImage(forceField, this.pos[0]-38, this.pos[1]-38);
	  }
	};

	module.exports = Ship;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(4);
	const MovingObject = __webpack_require__(5);

	function Bullet(posOptions) {
	  let options = { 
	    game: posOptions['game'], 
	    pos: posOptions['pos'], 
	    vel: posOptions['vel'], 
	    angle: posOptions['angle'],  
	    radius: 5, 
	    wrappable: false, 
	    type: 0,
	    hasPowerup: false
	  }
	  MovingObject.call(this, options);
	}
	Utils.inherits(Bullet, MovingObject);

	Bullet.prototype.draw = function (ctx) {
	  const img = new Image();
	  let that = this;
	  img.onload = function () {
	    if(!that.game.lose() && !that.game.win()) {
	      ctx.drawImage(img, 0, 0)
	    } 
	  };
	  img.src = 'images/laser.png';
	  let rotatedLaser = Utils.rotateAndCache(img, this.angle)
	  ctx.drawImage(rotatedLaser, this.pos[0]-this.radius, this.pos[1]-this.radius)
	};

	module.exports = Bullet;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(4);
	const MovingObject = __webpack_require__(5);

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
	  chance = Math.floor(Math.random() * 320)
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

/***/ }
/******/ ]);
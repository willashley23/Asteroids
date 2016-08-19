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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(3);
	const Ship = __webpack_require__(6);
	const img = new Image();

	function Game() {
	  this.asteroids = [];
	  this.addAsteroids();
	  this.ship = new Ship({pos: this.randomPosition(), game: this});
	  this.bullets = [];
	  this.lives = 3;
	}

	Game.DIM_X = 800;
	Game.DIM_Y = 605;
	Game.NUM_ASTEROIDS = 5;

	Game.prototype.draw = function(ctx, speed) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  let that = this;
	  img.onload = function () {
	    if(!that.lose()) {
	      ctx.drawImage(img, 0, 0)
	    } 
	  };
	  img.src = 'space.png';
	  let y = 0;
	  let x = 0;
	  y += speed;
	  ctx.drawImage(img, x,y);
	  ctx.drawImage(img, x, y - Game.DIM_Y);
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

	Game.prototype.addAsteroids = function(fragment = null, respawnPos = null) {
	   if (fragment === null) {
	     for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
	        let x = Math.floor(Math.random() * 500 );
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

	Game.prototype.step = function () {
	  this.moveObjects();
	  this.checkCollisions();
	};

	Game.prototype.allObjects = function () {
	  return this.asteroids.concat([this.ship]).concat(this.bullets);
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
	    vel: Utils.randomVec(), 
	    wrappable: true, 
	    type: Utils.randomNum(), 
	    angle: 0
	  }
	  MovingObject.call(this, options);
	}

	Utils.inherits(Asteroid, MovingObject);


	Asteroid.prototype.collideWith = function(otherObject) {
	  if (otherObject instanceof Ship) {
	    otherObject.relocate();
	    this.game.decreaseLives();
	  } else if (otherObject instanceof Bullet) {
	    if (this.radius === 30 && Utils.fragmentChance() === 1) {
	      this.game.removeBullet(otherObject);
	      currPos = this.pos
	      this.game.addAsteroids(true, [this.pos[0],this.pos[1]]);
			  this.game.removeAsteroid(this);
	    } else {
	      this.game.removeAsteroid(this);
	    }
		}
	};
	  
	Asteroid.prototype.draw = function (ctx) {
	  if (this.type === 1) {
	  const img = new Image();
	  let that = this
	   img.onload = function () {
	    if(!that.game.lose()) {
	      ctx.drawImage(img, 0, 0)
	    } 
	  };
	    if (this.radius === 15) {
	      img.src = 'smallasteroid1.png';
	    } else {
	      img.src = 'asteroid1.png'
	    }
	  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
	  } else {
	    const img = new Image();
	    let that = this
	   img.onload = function () {
	    if(!that.game.lose()) {
	      ctx.drawImage(img, 0, 0)
	    } 
	  };
	   if (this.radius === 15) {
	    img.src = 'smallasteroid2.png'
	   } else {
	    img.src = 'asteroid2.png';
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

	  randomVec: function() {
	    let x = Math.floor(Math.random() * 2 ) + 1;
	    let y = Math.floor(Math.random() * 2 ) + 1;
	    return [x,y];
	  },

	  randomNum: function() {
	    let num = Math.floor(Math.random() * 2) + 1
	    return num;
	  },

	  fragmentChance: function() {
	    let num = Math.floor(Math.random() * 3) + 1
	    return num
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

	function Ship(posOptions) {
	  let options = {
	    game: posOptions['game'], 
	    pos: posOptions['pos'],
	    radius: 20,
	    vel: [0,0],
	    wrappable: true,
	    type: 0,
	    angle: 0  
	  } 
	  MovingObject.call(this, options);
	  this.facingDir = 0;
	}

	Utils.inherits(Ship, MovingObject);

	Ship.prototype.relocate = function () {
	  this.pos = this.game.randomPosition();
	  this.vel = [0,0];
	};


	Ship.prototype.fireBullet = function () {
	  let bulletVel = [0,0]
	  if (this.facingDir > 1.4 && this.facingDir < 2) {
	    bulletVel = [10,0]
	  } else if (this.facingDir < 0) {
	    bulletVel = [-10,0]
	  } else if (this.facingDir > 2) {
	    bulletVel = [0,10]
	  } else {
	    bulletVel = [0,-10]
	  }
	  let bullet = new Bullet( {
	    pos: this.pos, 
	    vel: bulletVel, 
	    game: this.game, 
	    angle: this.facingDir
	  });
	  this.game.bullets.push(bullet);
	};

	  
	Ship.prototype.power = function (impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];

	  // Calculate angle of ship
	  let dest = [(this.pos[0]+impulse[0]),[(this.pos[1]+impulse[1])]];
	  let targetX = dest[0];
	  let targetY = dest[1];
	  let tx = targetX - this.pos[0]
	  let ty = targetY - this.pos[1]
	  let radians = Math.atan2(-tx,-ty) * -1;
	  this.facingDir = radians;
	};

	Ship.prototype.move = function () {
	  if (this.isWrappable) {
	    this.pos = this.game.wrap(this.pos);
	  }
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  // Attenuate velocity over time
	  this.vel[0] *= .98;
	  this.vel[1] *= .98;
	};

	Ship.prototype.convertToRadians = function(degree) {
	  return degree*(Math.PI/180);
	}

	// Draw ship on seperate canvas in order to rotate
	Ship.prototype.rotateAndCache = function(image,angle) {
	  let offscreenCanvas = document.createElement('canvas');
	  let offscreenCtx = offscreenCanvas.getContext('2d');

	  let size = Math.max(image.width, image.height);
	  offscreenCanvas.width = size;
	  offscreenCanvas.height = size;

	  offscreenCtx.translate(size/2, size/2);
	  offscreenCtx.rotate(angle);
	  offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));

	  return offscreenCanvas;
	}

	Ship.prototype.draw = function (ctx) {
	  const img = new Image();
	  let that = this
	  img.onload = function () {
	    if(!that.game.lose()) {
	      ctx.drawImage(img, 0, 0)
	    } 
	  };
	  img.src = 'galaga_ship.png';
	  let rotatedShip = this.rotateAndCache(img,this.facingDir)
	  ctx.drawImage(rotatedShip, this.pos[0]-this.radius, this.pos[1]-this.radius);
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
	    type: 0
	  }
	  MovingObject.call(this, options);
	}
	Utils.inherits(Bullet, MovingObject);


	Bullet.prototype.rotateAndCache = function(image, angle) {
	  let offscreenCanvas = document.createElement('canvas');
	  let offscreenCtx = offscreenCanvas.getContext('2d');

	  let size = Math.max(image.width, image.height);
	  offscreenCanvas.width = size;
	  offscreenCanvas.height = size;

	  offscreenCtx.translate(size/2, size/2);
	  offscreenCtx.rotate(angle);
	  offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));

	  return offscreenCanvas;
	}

	Bullet.prototype.draw = function (ctx) {
	  const img = new Image();
	  let that = this;
	  img.onload = function () {
	    if(!that.game.lose()) {
	      ctx.drawImage(img, 0, 0)
	    } 
	  };
	  img.src = 'laser.png';
	  let rotatedLaser = this.rotateAndCache(img,this.angle)
	  ctx.drawImage(rotatedLaser, this.pos[0]-this.radius, this.pos[1]-this.radius)
	};

	module.exports = Bullet;


/***/ }
/******/ ]);
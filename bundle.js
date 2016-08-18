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
	}

	Game.DIM_X = 800;
	Game.DIM_Y = 605;
	Game.NUM_ASTEROIDS = 5;


	Game.prototype.draw = function(ctx, speed) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  img.onload = function () {
	    ctx.drawImage(img, 0, 0)
	  };
	  img.src = 'space.png';
	  let y = 0;
	  let x = 0;
	  // Moved the lets togther.
	  y += speed;
	  ctx.drawImage(img, x,y);
	  ctx.drawImage(img, x, y - Game.DIM_Y);
	  if (y >= Game.DIM_Y) {
	      console.log("hello")
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


	Game.prototype.addAsteroids = function() {
	  for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
	    let x = Math.floor(Math.random() * 500 );
	    let y = Math.floor(Math.random() * 500);
	    let asteroid = new Asteroid({game: this, pos: [x, y]});
	    this.asteroids.push(asteroid);
	  }
	};


	Game.prototype.checkCollisions = function () {
	  this.allObjects().forEach( (asteroid1) => {
	    this.allObjects().forEach( (asteroid2) => {
	      if (asteroid1.isCollidedWith(asteroid2) && asteroid1 !== asteroid2) {
	        asteroid1.collideWith(asteroid2);
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
	  let options = {game: posOptions['game'], color: 'brown', pos: posOptions['pos'], radius: 30, vel: Utils.randomVec(), wrappable: true, type: Utils.randomNum(), angle: 0
	}
	  MovingObject.call(this, options);
	}
	Utils.inherits(Asteroid, MovingObject);


	Asteroid.prototype.collideWith = function(otherObject) {
	  if (otherObject instanceof Ship) {
	    otherObject.relocate();
	  } else if (otherObject instanceof Bullet) {
			this.game.removeAsteroid(this);
		}
	};


	  
	Asteroid.prototype.draw = function (ctx) {
	  if (this.type === 1) {
	  const img = new Image();
	   img.onload = function () {
	    ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius)
	  };
	    img.src = 'asteroid1.png';
	  ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
	  } else {
	    const img = new Image();
	   img.onload = function () {
	    ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius)
	  };
	    img.src = 'asteroid2.png';
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
	  this.color = options['color'];
	  this.isWrappable = options['wrappable'];
	  this.type = options['type'];
	  this.angle = options['angle'];
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
	  let options = {game: posOptions['game'], color: 'green', pos: posOptions['pos'], radius: 20, vel: [0,0], wrappable: true, type: 0, angle: 0}
	  MovingObject.call(this, options);
	  this.facingDir = 0;
	  this.H = window.innerHeight; //*0.75,
	  this.W = window.innerWidth; //*0.75;
	  this.xc = this.W/2; //zeby bylo w centrum :v
	  this.yc = this.H/2; //jw.
	  this.x =  this.xc;
	  this.y =  this.yc;
	  this.dv = 0.2;
	  this.dt = 1;
	  this.vx = 0;
	  this.vy = 0;
	  this.maxVel = 10;
	}

	Utils.inherits(Ship, MovingObject);

	Ship.prototype.relocate = function () {
	  this.pos = this.game.randomPosition();
	  this.vel = [0,0];
	};


	Ship.prototype.fireBullet = function () {
	  let bulletVel = [(this.vel[0] * 4), (this.vel[1] * 5) - 10];
	  let bullet = new Bullet({pos: this.pos, vel: bulletVel, game: this.game, angle: this.facingDir});
	  this.game.bullets.push(bullet);
	};

	  
	Ship.prototype.power = function (impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];

	  let dest = [(this.pos[0]+impulse[0]),[(this.pos[1]+impulse[1])]];
	  let targetX = dest[0];
	  let targetY = dest[1];
	  var tx = targetX - this.pos[0]
	  var ty = targetY - this.pos[1]
	  let dist = Math.sqrt(tx * tx + ty * ty);
	  var radians = Math.atan2(-tx,-ty) * -1;
	  this.facingDir = radians;
	  console.log(this.facingDir);
	};

	Ship.prototype.move = function () {
	  if (this.isWrappable) {
	    this.pos = this.game.wrap(this.pos);
	  }
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  this.vel[0] *= .98;
	  this.vel[1] *= .98;
	};

	Ship.prototype.convertToRadians = function(degree) {
	  return degree*(Math.PI/180);
	}

	Ship.prototype.rotateAndCache = function(image,angle) {
	  var offscreenCanvas = document.createElement('canvas');
	  var offscreenCtx = offscreenCanvas.getContext('2d');

	  var size = Math.max(image.width, image.height);
	  offscreenCanvas.width = size;
	  offscreenCanvas.height = size;

	  offscreenCtx.translate(size/2, size/2);
	  offscreenCtx.rotate(angle);
	  offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));

	  return offscreenCanvas;
	}



	Ship.prototype.draw = function (ctx) {
	  const img = new Image();
	  img.onload = function () {
	    ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius)
	  };
	  img.src = 'galaga_ship.png';
	  // ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
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
	  let options = {game: posOptions['game'], color: 'red', pos: posOptions['pos'], radius: 5, vel: posOptions['vel'], wrappable: false, type: 0, angle: posOptions['angle']}
	  MovingObject.call(this, options);
	}
	Utils.inherits(Bullet, MovingObject);


	Bullet.prototype.rotateAndCache = function(image, angle) {
	  var offscreenCanvas = document.createElement('canvas');
	  var offscreenCtx = offscreenCanvas.getContext('2d');

	  var size = Math.max(image.width, image.height);
	  offscreenCanvas.width = size;
	  offscreenCanvas.height = size;

	  offscreenCtx.translate(size/2, size/2);
	  offscreenCtx.rotate(angle);
	  offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));

	  return offscreenCanvas;
	}

	Bullet.prototype.draw = function (ctx) {
	  const img = new Image();
	  img.onload = function () {
	    ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius)
	  };
	  img.src = 'laser.png';
	  // ctx.drawImage(img, this.pos[0]-this.radius, this.pos[1]-this.radius);
	  let rotatedLaser = this.rotateAndCache(img,this.angle)
	  ctx.drawImage(rotatedLaser, this.pos[0]-this.radius, this.pos[1]-this.radius)
	};

	module.exports = Bullet;


/***/ }
/******/ ]);
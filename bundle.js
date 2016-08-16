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

	// const KeyMaster = require('./keymaster.js');


	function GameView(ctx) {
	  this.ctx = ctx;
	  this.game = new Game();
	}

	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  const animate = () => {
	    this.game.step();
	    this.game.draw(this.ctx);
	    requestAnimationFrame(animate);
	  };
	  animate();
	};

	GameView.prototype.bindKeyHandlers = function() {
	  key('right', () => {
	    this.game.ship.power([1, 0]);
	  });
	  key('left', () => {
	    this.game.ship.power([-1, 0]);
	  });
	  key('down', () => {
	    this.game.ship.power([0, 1]);
	  });
	  key('up', () => {
	    this.game.ship.power([0, -1]);
	  });
	  key('space', () => {
	    this.game.ship.fireBullet();
	  });
	};


	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(3);
	const Ship = __webpack_require__(6);

	function Game() {
	  this.asteroids = [];
	  this.addAsteroids();
	  this.ship = new Ship({pos: this.randomPosition(), game: this});
	  this.bullets = [];
	}

	Game.DIM_X = 800;
	Game.DIM_Y = 800;
	Game.NUM_ASTEROIDS = 5;

	Game.prototype.draw = function(ctx) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  this.allObjects().forEach( (asteroid) => {
	    asteroid.draw(ctx);
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
	  if (newX > Game.DIM_X+ 50) {
	    newX = 0;
	  }
	  if (newY > Game.DIM_Y + 50) {
	    newY = 0;
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
	  let options = {game: posOptions['game'], color: 'brown', pos: posOptions['pos'], radius: 30, vel: Utils.randomVec(), wrappable: true}
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
	    let x = Math.floor(Math.random() * 5 );
	    let y = Math.floor(Math.random() * 5 );
	    return [x,y];
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

	//Dist([x_1, y_1], [x_2, y_2]) = sqrt((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2)
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
	  let options = {game: posOptions['game'], color: 'green', pos: posOptions['pos'], radius: 20, vel: [0,0], wrappable: true}
	  MovingObject.call(this, options);
	}

	Utils.inherits(Ship, MovingObject);

	Ship.prototype.relocate = function () {
	  this.pos = this.game.randomPosition();
	  this.vel = [0,0];
	};

	Ship.prototype.power = function (impulse) {
	  console.log(this.vel);
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	};

	Ship.prototype.fireBullet = function () {
	  let bulletVel = [this.vel[0] + 2, this.vel[1] + 5];
	  let bullet = new Bullet({pos: this.pos, vel: bulletVel, game: this.game});
	  this.game.bullets.push(bullet);
	};


	module.exports = Ship;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	const Utils = __webpack_require__(4);
	const MovingObject = __webpack_require__(5);
	// const Asteroid = require('./asteroid.js');

	function Bullet(posOptions) {
	  let options = {game: posOptions['game'], color: 'red', pos: posOptions['pos'], radius: 10, vel: posOptions['vel'], wrappable: false}
	  MovingObject.call(this, options);
	}
	Utils.inherits(Bullet, MovingObject);
	console.log(Bullet);
	console.log(MovingObject);
	// console.log(Asteroid);

	Bullet.prototype.collideWith = function(otherObject) {
	  // debugger;
	  // if (otherObject instanceof Asteroid) {
	  //   this.game.removeAsteroid(otherObject);
	  // }
	};



	module.exports = Bullet;


/***/ }
/******/ ]);
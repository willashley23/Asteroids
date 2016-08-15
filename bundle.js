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

	const GameView = __webpack_require__(2);

	document.addEventListener("DOMContentLoaded", () => {
	  let canvasEl = document.getElementById('game-canvas');
	  let ctx = canvasEl.getContext('2d');
	  let gameView = new GameView(ctx);
	  gameView.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(3);

	function MovingObject(options) {
	  this.game = options['game'];
	  this.pos = options['pos'];
	  this.vel = options['vel'];
	  this.radius = options['radius'];
	  this.color = options['color'];
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
	  this.pos = this.game.wrap(this.pos);
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	};


	module.exports = MovingObject;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(3);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(4);

	function Game() {
	  this.asteroids = [];
	  this.addAsteroids();
	}

	Game.DIM_X = 800;
	Game.DIM_Y = 800;
	Game.NUM_ASTEROIDS = 5;

	Game.prototype.draw = function(ctx) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  this.asteroids.forEach( (asteroid) => {
	    asteroid.draw(ctx);
	  });
	};

	Game.prototype.moveObjects = function () {
	  this.asteroids.forEach( (asteroid) => {
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

	module.exports = Game;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	
	const Utils = __webpack_require__(5);
	const MovingObject = __webpack_require__(1);

	function Asteroid(posOptions) {
	  let options = {game: posOptions['game'], color: 'brown', pos: posOptions['pos'], radius: 30, vel: Utils.randomVec()}
	  MovingObject.call(this, options);
	}

	Utils.inherits(Asteroid, MovingObject);

	//inherit

	module.exports = Asteroid;


/***/ },
/* 5 */
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


/***/ }
/******/ ]);
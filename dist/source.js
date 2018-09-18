// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"lib/utils.js":[function(require,module,exports) {
var Util = {
  inherits: function inherits(childClass, parentClass) {
    function Surrogate() {}
    Surrogate.prototype = parentClass.prototype;
    childClass.prototype = new Surrogate();
    childClass.prototype.constructor = childClass;
  },

  randomVec: function randomVec() {
    var difficulty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "easy";

    var x = void 0;
    var y = void 0;
    if (difficulty === "hard" || difficulty === "endless") {
      x = Math.floor(Math.random() * 4) + 1;
      y = Math.floor(Math.random() * 4) + 1;
    } else {
      x = Math.floor(Math.random() * 2) + 1;
      y = Math.floor(Math.random() * 2) + 1;
    }
    return [x, y];
  },

  randomPos: function randomPos() {
    var x = Math.floor(Math.random() * 600) + 1;
    var y = Math.floor(Math.random() * 600) + 1;
    return [x, y];
  },

  randomNum: function randomNum() {
    var num = Math.floor(Math.random() * 2) + 1;
    return num;
  },

  fragmentChance: function fragmentChance() {
    var difficulty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "easy";

    var num = void 0;
    if (difficulty === "hard") {
      num = Math.floor(Math.random() * 2) + 1;
    } else {
      num = Math.floor(Math.random() * 3) + 1;
    }
    return num;
  },

  rotateAndCache: function rotateAndCache(image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var offscreenCtx = offscreenCanvas.getContext('2d');

    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;

    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));

    return offscreenCanvas;
  },

  hideHomeScreen: function hideHomeScreen() {
    document.getElementById('game-header').style.display = "none";
    document.getElementById('wasd').style.display = "none";
    document.getElementById('difficulty').style.display = "none";
    document.getElementById('li1').style.display = "none";
    document.getElementById('li2').style.display = "none";
    document.getElementById('li3').style.display = "none";
    document.getElementById('li4').style.display = "none";
    document.getElementById('controls').style.display = "none";
    document.getElementById('sub-controls').style.display = "none";
  },

  revealHTML: function revealHTML() {
    document.getElementById('game-header').style.display = "block";
    document.getElementById('game-end').style.display = "block";
  }

};

module.exports = Util;
},{}],"lib/moving_object.js":[function(require,module,exports) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MovingObject = function () {
    function MovingObject(options) {
        _classCallCheck(this, MovingObject);

        this.game = options.game;
        this.pos = options.pos;
        this.vel = options.vel;
        this.radius = options.radius;
        this.isWrappable = options.wrappable;
        this.type = options.type;
        this.angle = options.angle;
        this.justSpawned = options.justSpawned;
        this.hasPowerup = options.hasPowerup;
    }

    _createClass(MovingObject, [{
        key: 'draw',
        value: function draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
            ctx.fill();
        }
    }, {
        key: 'move',
        value: function move() {
            if (this.isWrappable) {
                this.pos = this.game.wrap(this.pos);
            }
            this.pos[0] += this.vel[0];
            this.pos[1] += this.vel[1];
        }
    }, {
        key: 'isCollidedWith',
        value: function isCollidedWith(otherObject) {
            var dist = Math.sqrt(Math.pow(this.pos[0] - otherObject.pos[0], 2) + Math.pow(this.pos[1] - otherObject.pos[1], 2));
            var radii = this.radius + otherObject.radius;
            return dist < radii;
        }
    }, {
        key: 'collideWith',
        value: function collideWith(otherObject) {}
    }]);

    return MovingObject;
}();

;

module.exports = MovingObject;
},{"./game":"lib/game.js"}],"lib/bullet.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _moving_object = require('./moving_object');

var _moving_object2 = _interopRequireDefault(_moving_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bullet = function (_MovingObject) {
    _inherits(Bullet, _MovingObject);

    function Bullet(posOptions) {
        _classCallCheck(this, Bullet);

        var _this = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, posOptions));

        _this.radius = 5;
        _this.isWrappable = false;
        _this.type = 0;
        _this.hasPowerup = false;
        return _this;
    }

    _createClass(Bullet, [{
        key: 'draw',
        value: function draw(ctx) {
            var _this2 = this;

            var img = new Image();
            img.onload = function () {
                if (!_this2.game.lose() && !_this2.game.win()) {
                    ctx.drawImage(img, 0, 0);
                }
            };
            img.src = 'images/laser.png';
            var rotatedLaser = _utils2.default.rotateAndCache(img, this.angle);
            ctx.drawImage(rotatedLaser, this.pos[0] - this.radius, this.pos[1] - this.radius);
        }
    }]);

    return Bullet;
}(_moving_object2.default);

exports.default = Bullet;
},{"./utils":"lib/utils.js","./moving_object":"lib/moving_object.js"}],"lib/powerup.js":[function(require,module,exports) {
var Utils = require('./utils.js');
var MovingObject = require('./moving_object.js');

function PowerUp(posOptions) {
  var options = {
    game: posOptions['game'],
    radius: 15,
    justSpawned: false,
    vel: Utils.randomVec(),
    pos: Utils.randomPos(),
    type: Utils.randomNum(),
    wrappable: true,
    angle: 0,
    hasPowerup: false
  };
  this.powerupType = Math.floor(Math.random() * 2) + 1;
  MovingObject.call(this, options);
}

Utils.inherits(PowerUp, MovingObject);

PowerUp.prototype.randomPowerup = function () {
  var chance = Math.floor(Math.random() * 320);
  if (chance === 5 && this.game.powerups < 1) {
    this.game.powerups += 1;
    return true;
  } else {
    return false;
  }
};

PowerUp.prototype.draw = function (ctx) {
  var powerup = new Image();
  var that = this;
  powerup.onload = function () {
    if (!that.game.lose() && !that.game.win()) {
      ctx.drawImage(powerup, 0, 0);
    }
  };
  if (this.powerupType === 1) {
    powerup.src = 'images/powerup.png';
  } else {
    powerup.src = 'images/tripleshot.png';
  }
  if (this.game.powerups > 0 || this.randomPowerup()) {
    ctx.drawImage(powerup, this.pos[0] - this.radius, this.pos[1] - this.radius);
  }
};

module.exports = PowerUp;
},{"./utils.js":"lib/utils.js","./moving_object.js":"lib/moving_object.js"}],"lib/ship.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _moving_object = require('./moving_object');

var _moving_object2 = _interopRequireDefault(_moving_object);

var _bullet = require('./bullet');

var _bullet2 = _interopRequireDefault(_bullet);

var _powerup = require('./powerup');

var _powerup2 = _interopRequireDefault(_powerup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ship = function (_MovingObject) {
	_inherits(Ship, _MovingObject);

	function Ship(posOptions) {
		_classCallCheck(this, Ship);

		var _this = _possibleConstructorReturn(this, (Ship.__proto__ || Object.getPrototypeOf(Ship)).call(this, posOptions));

		_this.radius = 20;
		_this.vel = [0, 0];
		_this.isWrappable = true;
		_this.type = 0;
		_this.angle = 0;
		_this.hasPowerup = false;
		_this.hasTripleShot = false;
		_this.currentNumBullets = 0;
		_this.invulnerable = false;
		_this.facingDir = 0;
		return _this;
	}

	_createClass(Ship, [{
		key: 'relocate',
		value: function relocate() {
			var _this2 = this;

			this.invulnerable = true;
			this.pos = this.game.randomPosition();
			this.vel = [0, 0];
			window.setTimeout(function () {
				_this2.invulnerable = false;
			}, 1500);
		}
	}, {
		key: 'collideWith',
		value: function collideWith(otherObject) {
			if (otherObject instanceof _powerup2.default) {
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
		}
	}, {
		key: 'fireBullet',
		value: function fireBullet() {
			var bulletVel = [Math.sin(-this.facingDir) * -10, Math.cos(-this.facingDir) * -10];
			if (this.hasTripleShot) {
				var totalBullets = this.game.bullets.length;
				var secondBulletPos = void 0;
				var thirdBulletPos = void 0;
				if (totalBullets - this.currentNumBullets > 80) {
					this.hasTripleShot = false;
				}
				if (Math.abs(this.facingDir) > 3 || Math.round(this.facingDir) === 0) {
					secondBulletPos = [this.pos[0] - 30, this.pos[1]];
					thirdBulletPos = [this.pos[0] + 30, this.pos[1]];
				} else {
					secondBulletPos = [this.pos[0], this.pos[1] - 30];
					thirdBulletPos = [this.pos[0], this.pos[1] + 30];
				}
				var bullet1 = new _bullet2.default({
					pos: secondBulletPos,
					vel: bulletVel,
					game: this.game,
					angle: this.facingDir
				});
				var bullet2 = new _bullet2.default({
					pos: thirdBulletPos,
					vel: bulletVel,
					game: this.game,
					angle: this.facingDir
				});
				this.game.bullets.push(bullet1);
				this.game.bullets.push(bullet2);
			}
			var defaultBulletPos = void 0;
			if (this.facingDir === 0) {
				defaultBulletPos = [this.pos[0] - 3.5, this.pos[1] - 36];
			} else if (this.facingDir > 3) {
				defaultBulletPos = [this.pos[0] - 3.5, this.pos[1] + 36];
			} else {
				defaultBulletPos = [this.pos[0], this.pos[1] - 6];
			}
			var bullet3 = new _bullet2.default({
				pos: defaultBulletPos,
				vel: bulletVel,
				game: this.game,
				angle: this.facingDir
			});
			this.game.bullets.push(bullet3);
			new Audio('sounds/laser.wav').play();
		}
	}]);

	return Ship;
}(_moving_object2.default);

exports.default = Ship;


Ship.prototype.power = function (impulse) {
	this.vel[0] += impulse[0];
	this.vel[1] += impulse[1];
	var radians = Math.atan2(-this.vel[0], -this.vel[1]) * -1;
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
	var img = new Image();
	var forceField = new Image();
	var that = this;
	img.onload = function () {
		if (!that.game.lose() && !that.game.win()) {
			ctx.drawImage(img, 0, 0);
		}
	};
	forceField.onload = function () {
		if (!that.game.lose() && !that.game.win()) {
			ctx.drawImage(forceField, 0, 0);
		}
	};
	forceField.src = 'images/forcefield.png';
	img.src = 'images/galaga_ship.png';
	var rotatedShip = _utils2.default.rotateAndCache(img, this.facingDir);
	// Blink sprite to indicate invulnerabiltiy 
	if (!this.invulnerable || Math.floor(Date.now() / 60) % 2) {
		ctx.drawImage(rotatedShip, this.pos[0] - this.radius, this.pos[1] - this.radius);
	}
	if (this.hasPowerup) {
		ctx.drawImage(forceField, this.pos[0] - 38, this.pos[1] - 38);
	}
};
},{"./utils":"lib/utils.js","./moving_object":"lib/moving_object.js","./bullet":"lib/bullet.js","./powerup":"lib/powerup.js"}],"lib/asteroid.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _moving_object = require('./moving_object');

var _moving_object2 = _interopRequireDefault(_moving_object);

var _ship = require('./ship');

var _ship2 = _interopRequireDefault(_ship);

var _bullet = require('./bullet');

var _bullet2 = _interopRequireDefault(_bullet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Asteroid = function (_MovingObject) {
    _inherits(Asteroid, _MovingObject);

    function Asteroid(posOptions) {
        _classCallCheck(this, Asteroid);

        var _this = _possibleConstructorReturn(this, (Asteroid.__proto__ || Object.getPrototypeOf(Asteroid)).call(this, posOptions));

        _this.angle = 0;
        _this.hasPowerup = false;
        _this.isWrappable = true;
        _this.type = _utils2.default.randomNum();
        _this.vel = _utils2.default.randomVec(posOptions['game'.difficultySetting]);
        return _this;
    }

    _createClass(Asteroid, [{
        key: 'collideWith',
        value: function collideWith(otherObject) {
            if (otherObject instanceof _ship2.default && !otherObject.invulnerable) {
                if (otherObject.hasPowerup) {
                    otherObject.hasPowerup = false;
                    this.game.removeAsteroid(this);
                } else {
                    otherObject.relocate();
                    new Audio('sounds/hit.wav').play();
                    this.game.decreaseLives();
                }
            } else if (otherObject instanceof _bullet2.default) {
                if (this.radius === 30 && _utils2.default.fragmentChance(this.game.difficultySetting) === 1) {
                    this.game.removeBullet(otherObject);
                    var currPos = this.pos;
                    this.game.addAsteroids(true, [this.pos[0], this.pos[1]]);
                    this.game.removeAsteroid(this);
                } else {
                    this.game.removeBullet(otherObject);
                    this.game.removeAsteroid(this);
                }
                if (this.radius === 30) {
                    new Audio('sounds/explosion.wav').play();
                } else {
                    new Audio('sounds/explosionsmall.wav').play();
                }
            }
        }
    }]);

    return Asteroid;
}(_moving_object2.default);

exports.default = Asteroid;


Asteroid.prototype.draw = function (ctx) {
    var _this2 = this;

    if (this.type === 1) {
        var img = new Image();
        img.onload = function () {
            if (!_this2.game.lose() && !_this2.game.win()) {
                ctx.drawImage(img, 0, 0);
            }
        };
        if (this.radius === 15) {
            img.src = 'images/smallasteroid1.png';
        } else {
            img.src = 'images/asteroid1.png';
        }
        ctx.drawImage(img, this.pos[0] - this.radius, this.pos[1] - this.radius);
    } else {
        var _img = new Image();
        _img.onload = function () {
            if (!_this2.game.lose() && !_this2.game.win()) {
                ctx.drawImage(_img, 0, 0);
            }
        };
        if (this.radius === 15) {
            _img.src = 'images/smallasteroid2.png';
        } else {
            _img.src = 'images/asteroid2.png';
        }
        ctx.drawImage(_img, this.pos[0] - this.radius, this.pos[1] - this.radius);
    }
};
},{"./utils":"lib/utils.js","./moving_object":"lib/moving_object.js","./ship":"lib/ship.js","./bullet":"lib/bullet.js"}],"lib/game.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asteroid3 = require('./asteroid');

var _asteroid4 = _interopRequireDefault(_asteroid3);

var _ship = require('./ship');

var _ship2 = _interopRequireDefault(_ship);

var _powerup = require('./powerup');

var _powerup2 = _interopRequireDefault(_powerup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var img = new Image();
var heart = new Image();

var Game = function Game(difficulty) {
  _classCallCheck(this, Game);

  this.difficultySetting = difficulty;
  this.setAsteroidCount(this.difficultySetting);
  this.asteroids = [];
  this.addAsteroids();
  this.ship = new _ship2.default({ pos: this.randomPosition(), game: this });
  this.powerup = new _powerup2.default({ game: this });
  this.bullets = [];
  this.lives = 3;
  this.powerups = 0;
  this.powerupsArr = [this.powerup];
  // Start game with 2 seconds of invulnerability
};

exports.default = Game;

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
};

Game.prototype.draw = function (ctx, speed) {

  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  var that = this;
  img.onload = function () {
    if (!that.lose() && !that.win()) {
      ctx.drawImage(img, 0, 0);
    }
  };
  heart.onload = function () {
    if (!that.lose() && !that.win()) {
      ctx.drawImage(heart, 0, 0);
    }
  };
  heart.src = 'images/heart.png';
  img.src = 'images/space.png';
  var y = 0;
  var x = 0;
  var heartPos = 0;
  y += speed;
  ctx.drawImage(img, x, y);
  ctx.drawImage(img, x, y - Game.DIM_Y);

  for (var i = this.lives - 1; i >= 0; i--) {
    ctx.drawImage(heart, heartPos, 0);
    heartPos += 40;
  }

  if (y >= Game.DIM_Y) {
    y = 0;
  };
  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  this.allObjects().forEach(function (asteroid) {
    asteroid.move();
  });
};

Game.prototype.wrap = function (pos) {
  var newX = pos[0];
  var newY = pos[1];
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

Game.prototype.decreaseLives = function () {
  this.lives -= 1;
};

Game.prototype.lose = function () {
  if (this.lives <= 0) {
    return true;
  } else {
    return false;
  };
};

Game.prototype.win = function () {
  if (this.asteroids.length === 0) {
    return true;
  } else {
    return false;
  }
};

Game.prototype.addAsteroids = function () {
  var fragment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var respawnPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var endlessMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (endlessMode) {
    console.log(this.asteroids.length);
    for (var j = 0; j < 5; j++) {
      var y = Math.floor(Math.random() * 500);
      var asteroid = new _asteroid4.default({ game: this, pos: [800, y], radius: 30 });
      this.asteroids.push(asteroid);
    }
  } else if (fragment === null) {
    for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
      var x = Math.floor(Math.random() * 500);
      var _y = Math.floor(Math.random() * 500);
      var _asteroid = new _asteroid4.default({ game: this, pos: [x, _y], radius: 30 });
      this.asteroids.push(_asteroid);
    }
  } else {
    for (var _i = 0; _i < 3; _i++) {
      var _x4 = respawnPos[0];
      var _y2 = respawnPos[1];
      var _asteroid2 = new _asteroid4.default({ game: this, pos: [_x4, _y2], radius: 15, justSpawned: true });
      this.asteroids.push(_asteroid2);
    }
  }
};

Game.prototype.checkCollisions = function () {
  var _this = this;

  this.allObjects().forEach(function (object1) {
    _this.allObjects().forEach(function (object2) {
      if (object1.isCollidedWith(object2) && object1 !== object2) {
        object1.collideWith(object2);
      }
    });
  });
};

Game.prototype.removeAsteroid = function (asteroid) {
  var idx = this.asteroids.indexOf(asteroid);
  if (idx > -1) {
    this.asteroids.splice(idx, 1);
  }
};

Game.prototype.removeBullet = function (bullet) {
  var idx = this.bullets.indexOf(bullet);
  if (idx > -1) {
    this.bullets.splice(idx, 1);
  }
};

Game.prototype.removePowerUp = function (powerUp) {
  var idx = this.powerupsArr.indexOf(powerUp);
  if (idx > -1) {
    this.powerupsArr.splice(idx, 1);
  }
};

Game.prototype.step = function () {
  this.moveObjects();
  this.checkCollisions();
  if (this.difficultySetting === "endless" && this.asteroids.length < 5) {
    this.addAsteroids(null, null, true);
  }
};

Game.prototype.allObjects = function () {
  return this.asteroids.concat([this.ship]).concat(this.bullets).concat(this.powerupsArr);
};

Game.prototype.randomPosition = function () {
  var x = Math.floor(Math.random() * Game.DIM_X);
  var y = Math.floor(Math.random() * Game.DIM_Y);
  return [x, y];
};

//module.exports = Game;
},{"./asteroid":"lib/asteroid.js","./ship":"lib/ship.js","./powerup":"lib/powerup.js"}],"lib/game_view.js":[function(require,module,exports) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var img = new Image();
var DIM_X = 800;
var DIM_Y = 605;
var speed = 1;
var difficultySetting = "easy";

var GameView = function () {
    function GameView(ctx) {
        _classCallCheck(this, GameView);

        this.ctx = ctx;
        this.game = new _game2.default("easy");
        this.onHomeScreen = true;
    }

    _createClass(GameView, [{
        key: 'start',
        value: function start(callback) {
            this.bindKeyHandlers();
            this.animate(0);
        }
    }, {
        key: 'animate',
        value: function animate(time) {
            var _this = this;

            speed += 1;
            if (speed >= 605) {
                speed = 0;
            };

            if (this.onHomeScreen) {
                var _that = this;
                img.onload = function () {
                    _that.ctx.drawImage(img, 0, 0);
                };

                img.src = 'images/space.png';
                var y = 0;
                var x = 0;
                y += speed;
                this.ctx.drawImage(img, x, y);
                this.ctx.drawImage(img, x, y - DIM_Y);

                if (y >= DIM_Y) {
                    y = 0;
                };

                requestAnimationFrame(this.animate.bind(this));
                key('enter', function () {
                    _this.onHomeScreen = false;
                    _utils2.default.hideHomeScreen();
                });

                key('1', function () {
                    _this.onHomeScreen = false;
                    _utils2.default.hideHomeScreen();
                });

                key('2', function () {
                    _this.onHomeScreen = false;
                    _utils2.default.hideHomeScreen();
                    _this.game = new _game2.default("medium");
                });

                key('3', function () {
                    _this.onHomeScreen = false;
                    _utils2.default.hideHomeScreen();
                    _this.game = new _game2.default("hard");
                });

                key('4', function () {
                    _this.onHomeScreen = false;
                    _utils2.default.hideHomeScreen();
                    _this.game = new _game2.default("endless");
                });
            } else {
                this.game.step();
                this.game.draw(this.ctx, speed);
                if (!this.game.lose() && !this.game.win()) {
                    requestAnimationFrame(this.animate.bind(this));
                } else {
                    this.ctx.fillStyle = "white";
                    this.ctx.font = "italic " + 24 + "pt Arial";
                    that = this;
                    if (this.game.win()) {
                        document.getElementById('game-header').innerHTML = "You Win";
                        document.getElementById('game-header').style.left = "235px";
                        _utils2.default.revealHTML();
                        new Audio('sounds/victory.wav').play();
                    } else {
                        document.getElementById('game-header').innerHTML = "GAME OVER";
                        _utils2.default.revealHTML();
                        new Audio('sounds/loss.wav').play();
                    }
                    key('enter', function () {
                        _this.game = new _game2.default();
                        _this.start();
                    });
                }
            }
        }
    }, {
        key: 'bindKeyHandlers',
        value: function bindKeyHandlers() {
            var _this2 = this;

            key('d', function () {
                _this2.game.ship.power([2, 0]);
            });
            key('a', function () {
                _this2.game.ship.power([-2, 0]);
            });
            key('s', function () {
                _this2.game.ship.power([0, 2]);
            });
            key('w', function () {
                _this2.game.ship.power([0, -2]);
            });
            key('l', function () {
                _this2.game.ship.fireBullet();
            });
        }
    }]);

    return GameView;
}();

module.exports = GameView;
},{"./game":"lib/game.js","./utils":"lib/utils.js"}],"source.js":[function(require,module,exports) {
'use strict';

var _game_view = require('./lib/game_view.js');

var _game_view2 = _interopRequireDefault(_game_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("DOMContentLoaded", function () {
  var canvasEl = document.getElementById('game-canvas');
  var ctx = canvasEl.getContext('2d');
  var gameView = new _game_view2.default(ctx);
  gameView.start();
});
},{"./lib/game_view.js":"lib/game_view.js"}],"../../../../usr/local/lib/node_modules/parcel-bundler/lib/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '60033' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/lib/builtins/hmr-runtime.js","source.js"], null)
//# sourceMappingURL=/source.map
import Asteroid from './asteroid';
import Ship from './ship';
import PowerUp from './powerup';
const img = new Image();
const heart = new Image();

export default class Game {
    constructor(difficulty) {
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

Game.prototype.addAsteroids = function(fragment = null, respawnPos = null, endlessMode = false) {
  if (endlessMode) {
    console.log(this.asteroids.length)
    for (let j = 0; j < 5; j++) {
      let y = Math.floor(Math.random() * 500);
      let asteroid = new Asteroid({game: this, pos: [800, y], radius: 30});
      this.asteroids.push(asteroid);   
    }
  } else if (fragment === null) {
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
  if (this.difficultySetting === "endless" && this.asteroids.length < 5) {
    this.addAsteroids(null, null, true);
  }
};

Game.prototype.allObjects = function () {
  return this.asteroids.concat([this.ship]).concat(this.bullets).concat(this.powerupsArr);
};

Game.prototype.randomPosition = function () {
  let x = Math.floor(Math.random() * Game.DIM_X);
  let y = Math.floor(Math.random() * Game.DIM_Y);
  return [x,y];
};

//module.exports = Game;
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

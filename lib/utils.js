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

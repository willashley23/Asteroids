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

/**
 * A simple container as an example of the ArrayLike spec
 * 
 * triplet objects support length, index access, forEach, reverse, toString, and join.
 */

function triplet(a, b, c) {
  if(!(this instanceof triplet)) return new triplet(a, b, c);

  this["0"] = a;
  this["1"] = b;
  this["2"] = c;  
}

// ** marker that we implement Array methods **
triplet.prototype.__ArrayLike = true;

// we define length with a getter/setter to ensure that it remains "3"
Object.defineProperty(triplet.prototype, "length", {
  enumerable: true,
  configurable: true,
  get: function() { return 3; },
  set: function(v) { 
    if(v != 3) {
      throw "cannot set length to " + v + ", triplet must be length 3";
    }
  }
});

triplet.prototype.forEach = function(fn) {
  fn(this["0"]);
  fn(this["1"]);
  fn(this["2"]);
}

triplet.prototype.join = function(sep) {
  var s = sep || ",";
  return "" + this["0"] + s + this["1"] + s + this["2"];
}

triplet.prototype.toString = function() {
  return this.join();
}

// length + splice is often used for duck-typing, so it's good to implement
// (eg: implementing splice changes js/console output to look like an array)
triplet.prototype.splice = function() {
  throw "cannot splice triplet - must be length 3";
}

// The EcmaScript standard specifically allows array-like objects
// to use the Array prototype methods. For more info, see
// http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf
triplet.prototype.reverse = function(args) {
  return Array.prototype.reverse.apply(this, arguments);
}

/**
 * A simple container as an sample of the isArray spec
 * 
 * triplet objects support length, index access, forEach, and join.
 */

function triplet(a, b, c) {
  if(!(this instanceof triplet)) return new triplet(a, b, c);

  this.a = a;
  this.b = b;
  this.c = c;  
}

// ** marker that we implement the isArray interface **
triplet.prototype.isArray = '[object Array]';

triplet.prototype.length = 3;

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty
function accessByIndex(whichVar) {
  var d = accessByIndex.d || (
    accessByIndex.d = {
      enumerable: true,
      configurable: true,
    }
  );
  d.get = function() { return this[whichVar]; }
  d.set = function(v) { return this[whichVar] = v; }
  return d;
}
Object.defineProperty(triplet.prototype, "0", accessByIndex("a"));
Object.defineProperty(triplet.prototype, "1", accessByIndex("b"));
Object.defineProperty(triplet.prototype, "2", accessByIndex("c"));

triplet.prototype.forEach = function(fn) {
  fn(this.a);
  fn(this.b);
  fn(this.c);
}

triplet.prototype.join = function(sep) {
  var s = sep || ",";
  return "" + this.a + s + this.b + s + this.c;
}

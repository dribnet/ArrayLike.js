/**
 * Provides Array.isArrayLike method.
 * Also provides a polyfill for Array.isArray if it is absent.
 *
 * For more information: https://github.com/dribnet/ArrayLike.js
 */

(function(ar) {
  if(!ar.isArray) {
    ar.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === "[object Array]";
    };  
  }

  ar.isArrayLike = function(obj) {
    return obj && obj.__ArrayLike || ar.isArray(obj);    
  }
})(Array);

/**
 *  Simple example of a library that conforms to ArrayLike.js array checking
 *  to check that an object has Array methods instead of requiring supplied
 *  arguments to be genuine JavaScript Arrays.
 */

(function(window, document, undefined) {

var toString          = Object.prototype.toString,
    examplelib        = window.examplelib || (window.examplelib = {});

// main isArrayLike method
function isArrayLike(obj) {
    return obj && obj.__ArrayLike || Object.prototype.toString.call(obj) === '[object Array]';
}

// this is just for testing - usually a library would only have the one above
function isArrayLikeSecondary(obj) {
    return obj && obj.__ArrayLike || Array.isArray(obj);
}

// given an array, show the result of addition of elements
function displaySum(arr) {
  if(!isArrayLike(arr)) {
    alert("displaySum: Sorry " + arr + " is not ArrayLike");
    return;
  }
  var sum = 0;
  for(var i=0; i<arr.length; i++) {
    sum += arr[i];
  }
  document.body.innerHTML += arr.join(" + ") + " = " + sum + "<p>";
}

// given an array, show the result of multiplication of elements
function displayProduct(arr) {
  if(!isArrayLikeSecondary(arr)) {
    alert("displayProduct: Sorry " + arr + " is not ArrayLike");
    return;
  }
  var product = 1;
  arr.forEach(function (element) {
    product *= element;
  });
  document.body.innerHTML += arr.join(" * ") + " = " + product + "<p>";
}

// given an array, show the result of multiplication of elements
function displayReversed(arr) {
  if(!isArrayLike(arr)) {
    alert("displayReversed: Sorry " + arr + " is not ArrayLike");
    return;
  }
  document.body.innerHTML += "reverse: " + arr + " => ";
  arr.reverse();
  document.body.innerHTML += arr + "<p>";
  arr.reverse(); // put it back...
}

// publish external api
examplelib.displaySum = displaySum;
examplelib.displayProduct = displayProduct;
examplelib.displayReversed = displayReversed;

})(window, document);

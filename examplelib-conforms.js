/**
 *  Simple example of a library that conforms to isArray.js array checking
 */

(function(window, document, undefined) {

var toString          = Object.prototype.toString,
    examplelib        = window.examplelib || (window.examplelib = {});

// main isArray method
function isArray(obj) {
    return ((obj && obj.isArray === '[object Array]') || 
            (Object.prototype.toString.call(obj) === '[object Array]'));
}

// this is just for testing - usually a library would only have the one above
function isArraySecondary(obj) {
    return ((obj && obj.isArray === '[object Array]') || 
            (Array.isArray(obj)));
}

// given an array, show the result of addition of elements
function displaySum(arr) {
  if(!isArray(arr)) {
    alert("displaySum: Sorry " + arr + " is not an array");
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
  if(!isArraySecondary(arr)) {
    alert("displayProduct: Sorry " + arr + " is not an array");
    return;
  }
  var product = 1;
  arr.forEach(function (element) {
    product *= element;
  });
  document.body.innerHTML += arr.join(" * ") + " = " + product + "<p>";
}

// publish external api
examplelib.displaySum = displaySum;
examplelib.displayProduct = displayProduct;

})(window, document);

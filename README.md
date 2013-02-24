ArrayLike.js
============

A minimalist specification and polyfill for allowing any
JavaScript object to advertise itself as having Array functionality.

Summary
-------
```js
// javascript libraries can internally use the following to check if an object supports Array methods
function isArrayLike(obj) {
    return obj && obj.__ArrayLike || Object.prototype.toString.call(obj) === '[object Array]';
}

// javascript container objects can then indicate to libraries that they provide Array methods
myContainer.prototype.__ArrayLike = true;
```

Rationale
---------

JavaScript uses the built in Array type as the go-to sequential
container. Libraries invariably use it heavily in their interfaces
for providing containers for ordered data.

Many other container types exist that provide similar functionality
to JavaScript Arrays, but are implemented as JavaScript objects.
Several of these [array-like objects](https://www.inkling.com/read/javascript-definitive-guide-david-flanagan-6th/chapter-7/array-like-objects) are well established, such as the JavaScript `arguments` object for holding
variable-length arguments lists and the results of many DOM methods
such as `document.getElementsByTagName()`.
But other new container objects are also possible that can provide additional convenience
for the programmer, new semantics not otherwise available in the
JavaScript Array object, or might represent sequential types in
other programming languages implemented in JavaScript.

These new container objects often choose to implement some of all
of the JavaScript Array methods to provide an interface familiar to
JavaScript programmers and be interoperable with existing JavaScript
libraries. 
However, JavaScript interop is often thwarted by libraries
which inspect their arguments and require bona fide JavaScript Array as
a prerequisite to further processing.

This specification serves to offer an alternative to JavaScript
library writers in order to allow these chimera array-like objects
to advertise their ability to supports Array methods. [Several examples](Examples.md)
of potential use cases for using these array-like container objects
are also available separately.
In addition, this repo provides a polyfill for programmers who wish to
use these handy container objects today in lieu of cooperating JavaScript libraries.

ArrayLike.js Specification
==========================

A separate page details JavaScript's [current idioms
for determining if an object is an array](CurrentPractices.md).
For the two accepted best practices of using [Object.prototype.toString](CurrentPractices.md#objectprototypetostring) and
[Array.isArray](CurrentPractices.md#arrayisarray), the ArrayLike.js
specification adds one additional check on the object. Should
an object contain a property named `__ArrayLike` which evaluates
to true, then that object can be used in a context expecting
Array methods and funcationlity.

So for JavaScript library authors and maintainers, we propose an internal funciton
such as the following for checking if an object support Array methods:

```js
function isArrayLike(obj) {
    return obj && obj.__ArrayLike || Object.prototype.toString.call(obj) === '[object Array]';
}
```

We also endorse this secondary form which uses Array.isArray directly:

```js
function isArrayLike(obj) {
    return obj && obj.__ArrayLike || Array.isArray(obj);
}
```

Authors of container objects that wish to conform to this
standard have a very simple means of indicating to library
consumers that the container should be treated as an array:

```js
myContainer.prototype.__ArrayLike = true;
```

ArrayLike.js Polyfill
=====================

A JavaScript [polyfill is available](ArrayLikeIsArray.js) for using ArrayLike
containers on libraries that do not
otherwise use to the ArrayLike.js convention. This polyfill
works by patching the Object.prototype.toString method as well
as the Array.isArray method so that they container objects conforming to the
this ArrayLike.js specification will instead pass the standard JavaScript Array
introspection checks.
We also plan to allow this patch to be subsequently reversed
programmatically, which is useful when used with libraries that make
defensive copies of these methods.

The ArrayLike.js authors very much prefer JavaScript libraries to
conform to this ArrayLike specification so that this
polyfill is unnecessary. However, it is offered as a useful
crutch to anyone wanting to use the current family of
ArrayLike containers without modifying existing JavaScript
libraries.

Sample Code
===========

In addition to the ArrayLike polyfill, this repository contains [a simple example
of an ArrayLike container object](triplet.js), along with two libraries. [One library conforms
to the spec above](examplelib-conforms.js) and recognizes the container object as an array, and [the other
does not](examplelib-compatible.js) but is made to be compatible via [the polyfill](ArrayLikeIsArray.js). The [conforming example](http://dribnet.github.com/ArrayLike.js/conforms.html)
and the [polyfill example](http://dribnet.github.com/ArrayLike.js/polyfill.html) are both viewable online, and [viewing the source](conforms.html)
will show that the output is generated by feeding the example library native
arrays followed by an isArrayLike.js conformant container object.

isArray.js containers
---------------------
* [mrhyde](https://github.com/dribnet/strokes) lets native ClojureScript containers to play nice with JavaScript libraries.
* [array](https://github.com/MatthewMueller/array) provides a better array for the browser and node.js

JavaScript libraries recognizing isArray.js containers
------------------------------------------------------
* [D3.js](http://d3js.org/) treats objects that are not functions as arrays

JavaScript libraries compatible with isArray.js polyfill
--------------------------------------------------------
* [AngularJS](http://angularjs.org/) version 1.1.3-3c2aee01 or greater
* [Leaflet](http://leafletjs.com/) version 0.5.0 or greater

Contributing
------------
Feedback welcome.

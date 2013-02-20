isArray.js
==========

A minimalist specification and polyfill for allowing any
JavaScript object to advertise itself as an array.

Summary
-------
```js
// javascript libraries should use the following to check if an object is an array
function isArray(obj) {
    return ((obj && obj.isArray === '[object Array]') || 
            (Object.prototype.toString.call(obj) === '[object Array]'));
}

// javascript container objects can then indicate to libraries that they provide Array methods
myContainer.prototype.isArray = '[object Array]';
```

Rationale
---------

JavaScript uses the built in Array type as the go-to sequential
container. Libraries invariably use it heavily in their interfaces
for providing containers for ordered data.

Many other container types exist that provide similar functionality
to JavaScript Arrays, but are implemented as JavaScript Objects.
These container objects might provide additional convenience
for the programmer, new semantics not otherwise available in the
JavaScript Array object, or might represent sequential types in
other programming languages implemented in JavaScript.

These container objects often choose to implement some of all
of the JavaScript Array methods to provide an interface familiar to
JavaScript programmers and be interoperable with existing JavaScript
libraries. But JavaScript interop is often thwarted by libraries
which inspect their arguments and require bona fide Array as
a prerequisite to further processing.

This specification serves to offer an alternative to JavaScript
library writers in order to allow these chimera array-like objects
to advertise their intentions. [Several examples](Examples.md)
of potential use cases for using these array-like container objects
are also available separatley.
In addition, this repo provides a polyfill for programmers who wish to
use these handy container objects today in lieu of cooperating JavaScript libraries.

isArray.js Specification
========================

A separate page details JavaScript's [current idioms
for determining if an object is an array](CurrentPractices.md).
For the two accepted best practices of using [Object.prototype.toString](CurrentPractices.md#objectprototypetostring) and
[Array.isArray](CurrentPractices.md#arrayisarray), the isArray.js
specification adds one additional check on the object. Should
an object contain a property named `isArray` which is equal to
the ECMAScript standard Array string, then that object should
for all intents and purposes be treated as an Array as well.

So for JavaScript library authors and maintainers, we propose the
following function for checking if an object is an Array:

```js
function isArray(obj) {
    return ((obj && obj.isArray === '[object Array]') || 
            (Object.prototype.toString.call(obj) === '[object Array]'));
}
```

We also endorse this secondary form which uses Array.isArray directly:

```js
function isArray(obj) {
    return ((obj && obj.isArray === '[object Array]') || 
            (Array.isArray(obj)));
}
```

The `isArray` member was chosen to match the standard
Array.isArray method name. This field is set to the somewhat
unlikely string `[object Array]` as that closely matches
current best practices and is unlikely to collide objects
in the wild which happens to inadvertently contain an isArray
member.

Authors of container objects that wish to conform to this
standard have a very simple means of indicating to library
consumers that the container should be treated as an array:

```js
myContainer.prototype.isArray = '[object Array]';
```

isArray.js Polyfill
===================

A JavaScript [polyfill is available](isArray-polyfill.js) for using isArray.js containers on libraries that do not
otherwise conform to the isArray.js specification above. This polyfill
works by patching the Object.prototype.toString method as well
as the Array.isArray method so that they recognize objects matching
this isArray.js specification. We also plan to allow this patch to be subsequently reversed
programmatically, which is useful when used with libraries that make
defensive copies of these methods.

The isArray.js authors very much prefer JavaScript libraries to
conform to the isArray.js specification so that this
polyfill is unnecessary. However, it is offered as a useful
crutch to anyone wanting to use the current family of
isArray.js containers without modifying existing JavaScript
libraries.

Sample Code
===========

In addition to the isArray-polyfill, this repository contains [a simple example
of an isArray.js container object](triplet.js), along with two libraries. [One library conforms
to the spec above](examplelib-conforms.js) and recognizes the container object as an array, and [the other
does not](examplelib-compatible.js) but is made to be compatible via [the polyfill](isArray-polyfill.js). The [conforming example](http://dribnet.github.com/isArray.js/conforms.html)
and the [polyfill example](http://dribnet.github.com/isArray.js/polyfill.html) are both viewable online, and [viewing the source](conforms.html)
will show that the output is generated by feeding the example library native
arrays followed by an isArray.js conformant container object.

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

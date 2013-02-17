isArray.js
==========

A minimalist specification and polyfill for allowing any
JavaScript object to advertise itself as an array.

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
to advertise their intentions.
In addition, it provides a polyfill for programmers who wish to
use these objects today in lieu of cooperating JavaScript libraries.

Current Practices
-----------------
There are a several techniques that JavaScript libraries use
to verify that a JavaScript object is in fact an Array, but only
two of these are accepted as robust solutions by the JavaScript
community.

### instanceof Array

Inexperienced JavaScript programmers will choose the most obvious
solution:

```js
function isArray (obj) {
    return (obj instanceof Array);
}
```

This is a very common idiom, but is not robust. Specifically, it
is known to fail [in multi-frame DOM environments](http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/)
because objects do not share prototypes [across iframes](http://bugs.dojotoolkit.org/ticket/5334). It similarly
fails in other contexts, such as [node-webkit](https://github.com/angular/angular.js/pull/1966) where arrays can be created in
the Node.js context.

For these reasons the authors of isArray.js suggest never using
this technique in JavaScript libraries. [John Resig](http://en.wikipedia.org/wiki/John_Resig), [Dean Edwards](http://en.wikipedia.org/wiki/CssQuery), and other prominent JavaScript developers [concur](http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/#comment-37193).

### Duck-typing

A less common practice is to use to ad-hock duck-typing, checking
the object for known members of a JavaScript Array:

```js
function isArray(obj) {
  return obj != null && typeof obj === "object" &&
    'splice' in obj && 'join' in obj;
}
```

This technique is generally frowned upon as being too permissive. Here
any object that happens to have splice and join members will be treated
as an Array. There is also a lack of consensus on which members should
be probed as evidence of being an Array. We similarly do not
endorse this technique, especially since much better alternatives exist.

### Object.prototype.toString

The accepted best practice is to use the Object.prototype.toString technique:

```js
function isArray(obj) {
    return (Object.prototype.toString.call(obj) === '[object Array]');
}
```

This solution is [well known](http://stackoverflow.com/questions/4775722/javascript-check-if-object-is-array), widely used, and based on the [ECMAScript standard](http://www.ecma-international.org/ecma-262/5.1/#sec-9.9).

### Array.isArray

A more recent addition to ECMAScript addresses this issue specifically:

```js
function isArray(obj) {
    return Array.isArray(obj);
}
```
 
This is another excellent solution, provided the library need only target
ECMAScript 5 standard JavaScript engines. In all other situations, the
above Object.prototype.toString technique should be used instead.
Mozilla concurs with this opinion, and suggests [a polyfill based
on Object.prototype.toString](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray#Compatibility) when Array.isArray is not natively available.

isArray.js Specification
========================

As a supplement to the accepted [Object.prototype.toString](#objectprototypetostring) and
[Array.isArray](#arrayisarray) practices above, the isArray.js
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

What does isArray mean?
-----------------------

An object comforming to isArray.js simply means that it wishes
to be treated as an array. It does guarantee to follow
all JavaScript Array semantics or runtime characteristics of implemented methods.
Notably, it does not necessarily indicate that the object
provided conforms to the full JavaScript Array interface.

Instead, the burden is on the authors of the container objects
to document which subset of the Array interface is supported
and what performance issues might be in their use. This is
best understood with a few examples.

### Enhanced arrays

A common case is authors
of container objects that do not wish to modify
the Array prototype directly, but instead wish
to offer an enhanced array-like container object.

For example, the [array](https://github.com/MatthewMueller/array)
project provides array like objects that also support
new iteration techniques such as:

```js
    users
      .map('friends')
      .select('age > 20')
      .map('name.first')
      .select(/^T/)
```

In addition, this array object also supports event
callbacks on element addition and removal. These capabilities
offer several conveniences to the programmer, but at the
same time can be consumed by other JavaScript libraries
as a normal array via the isArray specification.

### Linked list

A linked list implementation could fully conform to the
isArray.js specification. This would very likely provide
improved performance on algorithms that rely heavily
on insertion. However, iteration over the list would
then be an O(n) operation, and so care should be
taken to avoid O(n²) code such as the following:

```js
var myArray = linkedListArray(sourceData);
for(var i=0; i < myArray.length; i++) {
    // do something to myArray[i]
}
```

Instead consumers of this container could be instructed to
prefer the O(n) forEach alternative:

```js
var myArray = linkedListArray(sourceData);
myArray.forEach(function(element) {
    // do something to element
});
```

### Lazy infinite sequences

An infinite sequence is a useful programming abstraction, though
this is not usually seen in JavaScript. An isArray.js implementation
could provide this functionality via a subset of the Array interface:

```js
var primes = lazySequenceOfAllPrimes();
var n = 0;
while(n < 100) n = primes.shift();
console.log("first prime > 100 is " + n);
```

These are just a few examples of ordered collections that
can usefully co-exist in the JavaScript environment as Array-like
objects.

isArray.js Polyfill
===================

A JavaScript [polyfill](http://en.wikipedia.org/wiki/Polyfill) is
available for using isArray.js containers on libraries that do not
otherwise conform to the isArray.js specification above. This polyfill
works by patching the Object.prototype.toString method as well
as the Array.isArray method so that they recognize objects matching
this isArray.js specification. We also plan to allow this patch to be subsequently reversed
programmatically, which is useful when used with libraries that make
defensive copies of these methods.

The isArray.js authors very much prefer JavaScript libraries to
conform to the isArray.js specification so that this
polyfill is unnecessary. However, it is offered as a useful
crutch to anyone wanting to use the growing family of
isArray.js containers without modifying existing JavaScript
libraries.

Sample Code
===========

In addition to the isArray-polyfill, this repository contains a simple example
of an isArray.js container object, along with two libraries. One library conforms
to the spec above and recognizes the container object as an array, and the other
does not but is made to be compatible via the polyfill. The [conforming example](http://dribnet.github.com/isArray.js/conforms.html)
and the [polyfill example](http://dribnet.github.com/isArray.js/polyfill.html) are both viewable online, and viewing the source
will show that the output is generated by feeding the example library native
arrays followed by an isArray.js conformant container object.

isArray.js containers
---------------------
* [mrhyde](https://github.com/dribnet/strokes) lets native ClojureScript containers to play nice with JavaScript libraries.
* [array](https://github.com/MatthewMueller/array) provides a better array for the browser and node.js

JavaScript libraries recognizing isArray.js containers
------------------------------------------------------
* Who wants to be the first?

JavaScript libraries compatible with isArray.js polyfill
--------------------------------------------------------
* [AngularJS](http://angularjs.org/) version 1.1.3-3c2aee01 or greater
* [Leaflet](http://leafletjs.com/) version 0.5.0 or greater

Contributing
------------
Feedback welcome.

Current Practices
=================
There are a several techniques that JavaScript libraries use
to verify that a JavaScript object is in fact an Array, but only
two of these are accepted as robust solutions by the JavaScript
community.

### instanceof Array

Often JavaScript programmers will choose the most obvious
solution:

```js
function isArray (obj) {
    return (obj instanceof Array);
}
```

This is a common idiom, but is not robust. Specifically, it
is known to fail [in multi-frame DOM environments](http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/)
because objects do not share prototypes [across iframes](http://bugs.dojotoolkit.org/ticket/5334). It similarly
fails in other contexts, such as [node-webkit](https://github.com/angular/angular.js/pull/1966) where arrays can be created in
the Node.js context.

For these reasons the authors of ArrayLike.js suggest never using
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

A recent addition to ECMAScript addresses this issue specifically:

```js
function isArray(obj) {
    return Array.isArray(obj);
}
```
 
This is another excellent solution, provided the library only targets
JavaScript 1.8.5 or greater. In all other situations, the
above Object.prototype.toString technique should be used instead.
Mozilla agrees with this opinion, and suggests [a polyfill based
on Object.prototype.toString](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray#Compatibility) when Array.isArray is not natively available.

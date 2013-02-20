Examples of Array-like objects
==============================

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

### Containers from other JavaScript languages

There are now many languages targeting the JavaScript platform, and
often these languages include their own container classes. As a
means of providing interoperability with existing JavaScript
libraries, these container classes can implement some or all
of the JavaScript Array methods. By doing so, the container
can be accessed natively by the non-JavaScript language
and also simultanously by the JavaScript library without
marshalling or serializing the container class.


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

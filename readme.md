I missed extensions from Swift / Objective-C, so I brought them to Javascript.

## install

```npm i adopt```

## use

```
const Extension = require('..').Extension

// Create an extension.
// An extension adds private methods to the types you specify.
// This extension adds a private toJson method to all Objects.
const jsonExt = Extension(Object) ({
  toJson(...args) {
    return JSON.stringify(this, ...args)
  }
})

const obj = {whee: 'this is fun'}

// You use brackets to call a private method, by
// looking it up in the extension.
//
// Like this:
console.log(obj [jsonExt.toJson] (null, 2))

// Prints:
//   {
//     "wheee": "this is fun"
//   }
```

### [Extension.defaultKey]

We might prefer to do this instead, though:

```
const json = Extension(Object) ({
    // The default key is what you'll get if you use the extension itself
    // to look up a member in an Object.
    [Extension.defaultKey]: 'json',
    
    // Oh, also, getters and setters work fine.
    get json() { return JSON.stringify(this) },
    
    toJson(...args) { return JSON.stringify(this, ...args) }
})

const self = {
    brain: {thoughts: {distracting: 'many', curious: true}},
    heart: {isOpen: true}
}

// Isn't this nice?
console.log(self [json])

// And this still works.
console.log(self [json.toJson] (0, 2))
```

You can be more specific in what you extend, or extend multiple things.

```
const sample = Extension(Array, String) ({
    _: require('lodash'),
    sample(...args) {
        return this._sample(this, ...args)
    }
})
```

## how does this work?

It monkey patches prototypes.

Every key in the object you provide gets mapped to a unique
[Symbol]. We add new properties to every prototype with those symbols
as keys, then we return the mapping.

## i thought monkey patching Object.prototype was very bad?

It's bad with string keys, because there's no way to pick a name that
you *know* won't be used in a future version of Javascript (unless you
can see the future, in which case you do not need this library).

[Symbols][Symbol], introduced in ES6, make this safe.

Like Strings, Symbols can be keys for objects.

Unlike Strings, every Symbol is unique. Not only is collision
unlikely, it is impossible.

[Symbol]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol "ES6 Symbols"

# the future

As the name suggests, I also miss protocols. Those are not yet implemented
by this library, though perhaps the name is suggestive.



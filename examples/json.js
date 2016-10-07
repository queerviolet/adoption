const Extension = require('..').Extension

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

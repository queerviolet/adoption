'use strict'

const privately = key => Symbol(key)

const Extension =
        (...constructorsOrObjects) =>
        def =>
        extend.call(Extension.prototype,
                              def,
                              privately,
                              ...targets(constructorsOrObjects))

function extend(def={},
                keygen=privately,
                ...targets) {
  const extension = Object.create(this)
  const bases = extension [appliedTo]
          = extension [appliedTo] || targets
  for (let key of Object.keys(def)) {
    const sym = keygen(key)
    extension[key] = sym
    for (let target of bases) {
      // console.log('injecting', target, sym, def, key)
      // TODO: Handle property descriptors correctly
      target[sym] = def[key]
    }
  }
  if (def[defaultKey] in extension) {
    extension[Symbol.toPrimitive] = () => extension[def[defaultKey]]
  }  
  return extension
}

const targets = constructorsOrObjects =>
  constructorsOrObjects.map(x =>
                            (x instanceof Function && x.prototype)
                            ? x.prototype
                            : x)

Extension.prototype = {}

const appliedTo = Symbol('applied to'),
      defaultKey = Symbol('default key')

Object.assign(Extension, {appliedTo, defaultKey, targets, extend})

module.exports = Extension

if (!module.parent) {
  <!-- Example: reverse apply extension -->
  
  const reverseApply = Extension(Object) ({
    rcall(func, ...args) {
      return func.apply(this, args)
    },

    rapply(func, args) {
      return func.apply(this, args)
    }
  })

  console.log(reverseApply)

  function log(...args) { console.log(this, ...args) }

  function increment() { return this + 1 }

  2
  [reverseApply.rapply] (increment)
  [reverseApply.rapply] (log);

  "boom"
  [reverseApply.rapply] (increment)
  [reverseApply.rapply] (log);

  ({ valueOf() { return 99 } })
  [reverseApply.rapply] (increment)
  [reverseApply.rcall] (log, 'hello', 'world')

  <!-- Example: string reverse -->
    
  const rev = Extension(String) ({
    reverse() {
      let r = ''
      let i = this.length; while (--i >= 0) {
        r += this[i]
      }
      return r
    }
  })

  console.log("hello" [rev.reverse] ())
}

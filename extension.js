'use strict'

const privately = key => Symbol(key)

const Extension =
        (...constructorsOrObjects) =>
        def =>
        extend.call(Extension.prototype,
                              def,
                              privately,
                              ...targets(constructorsOrObjects))
module.exports = Extension

function extend(def={},
                keygen=privately,
                ...targets) {
  const extension = Object.create(this)
  const bases
          = extension [appliedTo]
          = extension [appliedTo] || targets  
  for (let key of Object.getOwnPropertyNames(def)) {
    const sym = keygen(key)
    extension[key] = sym
    for (let target of bases) {
      // console.log('injecting', target, sym, def, key)
      Object.defineProperty(target, sym,
                            Object.getOwnPropertyDescriptor(def, key))
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

Object.assign(Extension, {appliedTo,
                          defaultKey,
                          targets,
                          extend,
                          privately})

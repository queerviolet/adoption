'use strict'

const monkey = Symbol('public')
const appliedTo = Symbol('appliedTo')

const proto = {
  [monkey] (def) {
    return extend.call(this, def, publicly)
  }
}

const publicly = key => key,
      privately = key => Symbol(key)

const inject = (target, sym, def) => {
  console.log('injecting', target, sym, def)
  ;(target instanceof Function && target.prototype)?
    target.prototype[sym] = def
    : target[sym] = def
}

function extend(def={},
                keygen=privately,
                targets=[]) {
  const extension = Object.create(this)
  extension [appliedTo] = extension [appliedTo] || targets
  const bases = extension [appliedTo]
  for (let key of Object.keys(def)) {
    const sym = keygen(key)
    extension[key] = sym
    for (let target of bases)
      inject(target, sym, def[key])
  }
  return extension
}

const Extension =
        (...targets) =>
        def =>
        extend.call(proto,
                    def,
                    privately,
                    targets)


        <!-- Example: reverse apply extension -->
  
const reverseApply = Extension(Number, String) ({
  rcall(func, ...args) {
    return func.apply(this, args)
  },

  rapply(func, args) {
    return func.apply(this, args)
  }
})

console.log(reverseApply)

2 [reverseApply.rapply] (function() {
  return this + 1
}) [reverseApply.rapply] (console.log)

"boom" [reverseApply.rapply] (function() {
  return this + 1
}) [reverseApply.rapply] (console.log)

try {
  ;({ valueOf() { return 3 } }) [reverseApply.rapply] (function() {
    return this + 1
  }) [reverseApply.rapply]
} catch(ex) { console.error(ex) }



  <!-- Example: a public extension -->

const hiExt = Extension(Object) () [monkey] ({
  hello() { console.log('hi!') }
})

console.log(hiExt)

"hi".hello()

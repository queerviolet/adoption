'use strict'

const monkey = Symbol('public')
const appliedTo = Symbol('appliedTo')

const publicly = key => key,
      privately = key => Symbol(key)

const inject = (target, sym, def) => {
  console.log('injecting', target, sym, def)
  
  if (target instanceof Function && target.prototype)
    target.prototype[sym] = def
  else
    target[sym] = def
}

function extend(def={},
                keygen=privately,
                ...targets) {
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
        extend.call(Extension.prototype,
                    def,
                    privately,
                    ...targets)

Extension.prototype = {
  [monkey] (def) {
    return extend.call(this, def, publicly)
  }
}

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


  <!-- example: a scary public extension -->

const hiExt = Extension(Object) () [monkey] ({
  hello() { console.log('hi!') }
})

console.log(hiExt)

"hi".hello()

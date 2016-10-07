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


const {TESTS} = require('./test')
TESTS (module) `extend(def: Object,
                       keygen: String -> String|Symbol,
                       ...targets: [...Object]) -> Extension`
(suite => {
  const def = {
    hello() { return 'hello' },
    world() { return 'world' },
  }
  
  suite.test `monkey patches a definition onto some targets`
  (test => {
    const target = {}
    extend.call({}, def, key => key, target)
    test.expect(target)
      .to.deep.equal(def)
    test.done()
  })

  suite.test `returns a mapping of names to keys`
  (({expect, done}) => {
    const target = {}
    const mapping = extend.call({}, def, privately, target)

    expect(target)
      .not.to.deep.equal(def)
    expect(target[mapping.hello])
      .to.eql(def.hello)
    expect(target[mapping.world])
      .to.eql(def.world)
    expect(Object.getOwnPropertySymbols(target).length)
      .to.eql(2)
    done()
  })

  const property = Object.getOwnPropertyDescriptor
  suite.test `preserves property descriptors`
  (({expect, done}) => {
    const target = {}
    const def = {
      get hello() { return 'hi' },
      set world(val) { this.setterWasCalled = true }
    }
    const mapping = extend.call({}, def, privately, target)

    expect(property(target, mapping.hello))
      .to.deep.equal(property(def, 'hello'))
    expect(property(target, mapping.world))
      .to.deep.equal(property(def, 'world'))

    expect(target[mapping.hello])
      .to.eql('hi')
    target[mapping.world] = 'something'
    expect(target.setterWasCalled).to.eql(true)
    done()    
  })
})


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

Object.assign(Extension, {appliedTo, defaultKey, targets, extend})

if (!module.parent) {
  <!-- Example: reverse apply extension -->
  
  const pipe = Extension(Object) ({
    [Extension.defaultKey]: 'pipe',

    pipe(func, ...args) {
      const ret = func.apply(this, [this].concat(...args))
      if (typeof ret !== 'undefined')
        return ret
      else
        return this
    },
    
    rcall(func, ...args) {
      return func.apply(this, args)
    },

    rapply(func, args) {
      return func.apply(this, args)
    }
  })

  console.log(pipe)

  function add(rhs=1) { return this + rhs }

  2
  [pipe.rapply] (add)
  [pipe] (console.log);

  "boom"
  [pipe.rcall] (add, 'boom money')
  [pipe] (console.log);

  ({ data: 99, valueOf() { return this.data } })
  [pipe.rcall] (add)
  [pipe] (console.log, 'hello', 'world')
  [pipe] (x => x + 1)
  [pipe] (console.log)

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

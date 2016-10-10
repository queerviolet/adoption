const {TESTS} = require('./test')
TESTS (module) `Extension.extend(def: Object,
                       keygen: String -> String|Symbol,
                       ...targets: [...Object]) -> Extension`
(suite => {
  const {extend, privately} = require('./extension')
  
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

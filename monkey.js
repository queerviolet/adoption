const Extension = require('./extension')

const publicly = key => key

const monkey = Extension(Extension) ({
  [Extension.defaultKey]: 'monkey',
  monkey(def) { return Extension.extend.call(this, def, publicly) }
})

module.exports = monkey

if (!module.parent) {
  
  <!-- example: a scary public extension -->

  const hiExt = Extension(Object) () [monkey] ({
    hello() { console.log('hi!') }
  })
  
  console.log(hiExt)

  "hi".hello()
}

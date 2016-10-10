const Extension = require('..').Extension

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

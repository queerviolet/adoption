const TESTS = module => title => suite => {
  if (Array.isArray(title)) { title = title.join('') }

  const {expect} = require('chai')
  const Lab = require('lab')
  const lab = module.exports.lab = module.exports.lab || Lab.script()

  return lab.experiment(title,
                        () => suite({
                          before: lab.before,
                          beforeEach: lab.beforeEach,
                          after: lab.after,
                          afterEach: lab.afterEach,
                          test: title => test => {
                            if (Array.isArray(title)) {
                              title = title.join('')
                            }
                            return lab.test(title,
                                            done => test({expect, done}))
                          }
                        }))
}

const TEST = module => title => test => {
  if (Array.isArray(title)) { title = title.join('') }

  const {expect} = require('chai')
  const Lab = require('lab')
  const lab = module.exports.lab = module.exports.lab || Lab.script()
  return lab.test(title, done => test({expect, done}))
}

if (process.env.NODE_ENV === 'test') 
  module.exports = {TEST, TESTS}
else
  module.exports = {
    TEST: module => title => test => {},
    TESTS: module => title => suite => {},
  }

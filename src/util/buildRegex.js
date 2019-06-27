let _ = require('lodash/fp')

module.exports = _.flow(
  _.replace(/\s\s+/g, ' '),
  _.trim,
  _.split(' '),
  _.map(x => `(?=.*${x}.*)`),
  _.join(''),
  x => `.*${x}.*`
)

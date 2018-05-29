'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})

var _signale = require('signale')

var _signale2 = _interopRequireDefault(_signale)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

_signale2.default.config({
  displayTimestamp: true,
})

exports.default = _signale2.default
module.exports = exports['default']

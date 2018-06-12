'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _iconfont = require('./lib/iconfont.js');

var _iconfont2 = _interopRequireDefault(_iconfont);

var _signale = require('./lib/signale.js');

var _signale2 = _interopRequireDefault(_signale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(config) {
    var iconfont, project;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            iconfont = new _iconfont2.default(config);
            _context.next = 3;
            return iconfont.info();

          case 3:
            project = _context.sent;


            if (!project) {
              _signale2.default.fatal(new Error('access project ' + config.project + ' denied.'));
            }

            if (!project.project.font_is_old) {
              _context.next = 8;
              break;
            }

            _context.next = 8;
            return iconfont.update();

          case 8:
            _context.next = 10;
            return iconfont.download();

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function download(_x) {
    return _ref.apply(this, arguments);
  }

  return download;
}();

module.exports = exports['default'];
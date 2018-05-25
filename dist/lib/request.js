'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _cookie = require('./cookie.js');

var _cookie2 = _interopRequireDefault(_cookie);

var _constants = require('../constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateCookie(cookie, response) {
  var cookies = response.headers['set-cookie'] || [];
  cookies = Array.isArray(cookies) ? cookies : [cookies];

  cookies.forEach(function (str) {
    cookie.parse(str);
  });

  return response;
}

var Request = function () {
  function Request(config) {
    (0, _classCallCheck3.default)(this, Request);

    this.origin = config.origin;
    this.cookie = new _cookie2.default(config.key);
  }

  (0, _createClass3.default)(Request, [{
    key: 'request',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(path, options) {
        var response;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = (0, _assign2.default)({}, {
                  headers: {
                    cookie: this.cookie.serialize()
                  },
                  followRedirect: false,
                  throwHttpErrors: false
                }, options);

                // console.log(`[request] ${this.origin}${path} \n ${JSON.stringify(options, null, 2)}`)

                _context.next = 3;
                return (0, _got2.default)('' + this.origin + path, options);

              case 3:
                response = _context.sent;


                updateCookie(this.cookie, response);

                // console.log(response.headers, response.body)

                return _context.abrupt('return', response);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function request(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return request;
    }()
  }]);
  return Request;
}();

exports.default = Request;
module.exports = exports['default'];

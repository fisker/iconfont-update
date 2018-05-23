'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

var _package = require('../../package.json');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COOKIES_STORE_DIR = _path2.default.join(_os2.default.tmpdir(), _package.name);

try {
  _fs2.default.mkdirSync(COOKIES_STORE_DIR);
} catch (err) {}

var Cookie = function () {
  function Cookie(key) {
    (0, _classCallCheck3.default)(this, Cookie);

    this.storeFile = _path2.default.join(COOKIES_STORE_DIR, key + '.cookie.json');
    this.init();
  }

  (0, _createClass3.default)(Cookie, [{
    key: 'init',
    value: function init() {
      var file = this.storeFile;
      try {
        this.data = JSON.parse(_fs2.default.readFileSync(file));
      } catch (err) {
        this.data = {};
      }
    }
  }, {
    key: 'parse',
    value: function parse(str, options) {
      (0, _assign2.default)(this.data, _cookie2.default.parse(str, options));
      _fs2.default.writeFileSync(this.storeFile, (0, _stringify2.default)(this.data, null, 2));
    }
  }, {
    key: 'serialize',
    value: function serialize(options) {
      var _this = this;

      return (0, _keys2.default)(this.data).map(function (name) {
        return _cookie2.default.serialize(name, _this.data[name], options);
      }).join('; ');
    }
  }, {
    key: 'get',
    value: function get(name) {
      return this.data[name];
    }
  }]);
  return Cookie;
}();

exports.default = Cookie;
module.exports = exports['default'];

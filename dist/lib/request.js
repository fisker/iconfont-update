'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _cookie = require('./cookie.js');

var _cookie2 = _interopRequireDefault(_cookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sites = {
  github: {
    origin: 'https://github.com'
  },
  iconfont: {
    origin: 'http://iconfont.cn'
  }
};

function updateCookie(cookie, response) {
  var cookies = response.headers['set-cookie'] || [];
  cookies = Array.isArray(cookies) ? cookies : [cookies];

  cookies.forEach(function (str) {
    cookie.parse(str);
  });

  return response;
}

var Request = function () {
  function Request(siteName) {
    (0, _classCallCheck3.default)(this, Request);

    var site = sites[siteName];
    this.siteName = siteName;
    this.origin = site.origin;
    this.cookie = new _cookie2.default(siteName);
  }

  (0, _createClass3.default)(Request, [{
    key: 'request',
    value: function request(path, options) {
      var _this = this;

      options = (0, _assign2.default)({}, {
        headers: {
          cookie: this.cookie.serialize()
        },
        followRedirect: false,
        throwHttpErrors: false
      }, options);

      return (0, _got2.default)('' + this.origin + path, options).then(function (response) {
        return updateCookie(_this.cookie, response);
      });
    }
  }]);
  return Request;
}();

exports.default = Request;
module.exports = exports['default'];

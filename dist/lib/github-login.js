'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _request = require('./request.js');

var _request2 = _interopRequireDefault(_request);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ICONFONT_ORIGIN = 'http://iconfont.cn';
var ICONFONT_GITHUB_CALLBACK_URL = '/api/login/github/callback';

var GITHUB_ORIGIN = 'https://github.com';
var GITHUB_AUTHORIZE_URL = '/login/oauth/authorize';
var GITHUB_LOGIN_URL = '/login';
var GITHUB_SESSION_URL = '/session';

function parseAuthorizeData(body) {
  var re = /<input(?:.*?)name="(.*?)"(?:.*?)value="(.*?)"(?:.*?)>/g;
  var data = {};
  var result = void 0;
  while (result = re.exec(body)) {
    data[result[1]] = result[2];
  }

  return data;
}

var GithubLogin = function () {
  function GithubLogin(account, password) {
    (0, _classCallCheck3.default)(this, GithubLogin);

    this.account = account;
    this.password = password;
    this.request = new _request2.default('github');
  }

  (0, _createClass3.default)(GithubLogin, [{
    key: 'authorize',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('[github] loged, but need authorize');

                _context.next = 3;
                return this.request.request(GITHUB_AUTHORIZE_URL, {
                  form: true,
                  body: data
                });

              case 3:
                return _context.abrupt('return', _context.sent);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function authorize(_x) {
        return _ref.apply(this, arguments);
      }

      return authorize;
    }()
  }, {
    key: 'postLogin',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data) {
        var response, authenticityToken;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                response = void 0;


                console.log('[github] opening login form');
                _context2.next = 4;
                return this.request.request(GITHUB_LOGIN_URL, {
                  query: data
                });

              case 4:
                response = _context2.sent;
                authenticityToken = response.body.match(/<input(?:.*?)name="authenticity_token"(?:.*?)value="(.*?)"(?:.*?)>/)[1];

                if (authenticityToken) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt('return', false);

              case 8:

                console.log('[github] posting login data');

                _context2.next = 11;
                return this.request.request(GITHUB_SESSION_URL, {
                  query: data,
                  form: true,
                  body: {
                    login: this.account,
                    password: this.password,
                    authenticity_token: authenticityToken
                  }
                });

              case 11:
                response = _context2.sent;
                return _context2.abrupt('return', response);

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function postLogin(_x2) {
        return _ref2.apply(this, arguments);
      }

      return postLogin;
    }()
  }, {
    key: 'login',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(data) {
        var response, location;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                response = void 0;
                location = void 0;
                _context3.next = 4;
                return this.request.request(GITHUB_AUTHORIZE_URL, {
                  query: data
                });

              case 4:
                response = _context3.sent;


                location = response.headers.location || '';

                // github loged, but need authorize

                if (location) {
                  _context3.next = 11;
                  break;
                }

                _context3.next = 9;
                return this.authorize(parseAuthorizeData(response.body));

              case 9:
                response = _context3.sent;

                location = response.headers.location || '';

              case 11:
                if (!location.startsWith(ICONFONT_ORIGIN + ICONFONT_GITHUB_CALLBACK_URL)) {
                  _context3.next = 14;
                  break;
                }

                console.log('[github] loged && authorized');
                return _context3.abrupt('return', _queryString2.default.parseUrl(location).query);

              case 14:
                if (location.startsWith(GITHUB_ORIGIN + GITHUB_LOGIN_URL)) {
                  _context3.next = 16;
                  break;
                }

                return _context3.abrupt('return', false);

              case 16:
                _context3.next = 18;
                return this.postLogin(_queryString2.default.parseUrl(location).query);

              case 18:
                response = _context3.sent;

                if (response) {
                  _context3.next = 21;
                  break;
                }

                return _context3.abrupt('return', false);

              case 21:

                location = response.headers.location || '';

                if (location.startsWith(GITHUB_ORIGIN + GITHUB_AUTHORIZE_URL)) {
                  _context3.next = 24;
                  break;
                }

                return _context3.abrupt('return', false);

              case 24:

                console.log('[github] authorize');
                _context3.next = 27;
                return this.request.request(GITHUB_AUTHORIZE_URL, {
                  query: _queryString2.default.parseUrl(location).query
                });

              case 27:
                response = _context3.sent;

                location = response.headers.location || '';

                // github loged && authorized

                if (!location.startsWith(ICONFONT_ORIGIN + ICONFONT_GITHUB_CALLBACK_URL)) {
                  _context3.next = 31;
                  break;
                }

                return _context3.abrupt('return', _queryString2.default.parseUrl(location).query);

              case 31:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function login(_x3) {
        return _ref3.apply(this, arguments);
      }

      return login;
    }()
  }]);
  return GithubLogin;
}();

exports.default = GithubLogin;
module.exports = exports['default'];

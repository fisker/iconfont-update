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

var _signale = require('./signale.js');

var _signale2 = _interopRequireDefault(_signale);

var _constants = require('../constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseAuthorizeFormData(body) {
  var re = /<input(?:.*?)name="(.*?)"(?:.*?)value="(.*?)"(?:.*?)>/g;
  var data = {};
  var result = void 0;
  while (result = re.exec(body)) {
    data[result[1]] = result[2];
  }

  return data;
}

var GithubLogin = function () {
  function GithubLogin(config) {
    (0, _classCallCheck3.default)(this, GithubLogin);

    this.config = config;
    this.client = new _request2.default({
      origin: _constants.GITHUB_ORIGIN,
      key: config
    });
  }

  (0, _createClass3.default)(GithubLogin, [{
    key: 'request',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(path, options) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.client.request(path, options);

              case 2:
                return _context.abrupt('return', _context.sent);

              case 3:
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
  }, {
    key: 'get',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(path, data) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.client.request(path, {
                  query: data
                });

              case 2:
                return _context2.abrupt('return', _context2.sent);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function get(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'post',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(path, data) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.client.request(path, {
                  body: data,
                  form: true
                });

              case 2:
                return _context3.abrupt('return', _context3.sent);

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function post(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: 'authorizeForm',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(data) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _signale2.default.pending('loged, but need authorize.');

                data.authorize = 1;
                data.state = this.config.state;

                _context4.next = 5;
                return this.request(_constants.GITHUB_AUTHORIZE_URL, {
                  query: {
                    client_id: this.config.client,
                    redirect_uri: this.config.callback,
                    state: this.config.state
                  },
                  form: true,
                  body: data
                });

              case 5:
                return _context4.abrupt('return', _context4.sent);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function authorizeForm(_x7) {
        return _ref4.apply(this, arguments);
      }

      return authorizeForm;
    }()
  }, {
    key: 'getAuthenticityToken',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var authData, data, response;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                authData = {
                  client_id: this.config.client,
                  redirect_uri: this.config.callback,
                  state: this.config.state
                };
                data = {
                  client_id: this.config.client,
                  return_to: _constants.GITHUB_AUTHORIZE_URL + '?' + _queryString2.default.stringify(authData)
                };


                _signale2.default.pending('open login form...');
                _context5.next = 5;
                return this.get(_constants.GITHUB_LOGIN_URL, data);

              case 5:
                response = _context5.sent;
                return _context5.abrupt('return', response.body.match(/<input(?:.*?)name="authenticity_token"(?:.*?)value="(.*?)"(?:.*?)>/)[1]);

              case 7:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getAuthenticityToken() {
        return _ref5.apply(this, arguments);
      }

      return getAuthenticityToken;
    }()
  }, {
    key: 'postLogin',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        var response, authenticityToken;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                response = void 0;
                authenticityToken = void 0;
                _context6.prev = 2;
                _context6.next = 5;
                return this.getAuthenticityToken();

              case 5:
                authenticityToken = _context6.sent;
                _context6.next = 11;
                break;

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6['catch'](2);
                throw new Error('get authenticity_token failue.');

              case 11:

                _signale2.default.pending('posting login data...');

                _context6.next = 14;
                return this.request(_constants.GITHUB_SESSION_URL, {
                  form: true,
                  body: {
                    login: this.config.account,
                    password: this.config.password,
                    authenticity_token: authenticityToken
                  }
                });

              case 14:
                if (!(this.client.cookie.get('logged_in') !== 'yes')) {
                  _context6.next = 16;
                  break;
                }

                throw new Error('github login failue.');

              case 16:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[2, 8]]);
      }));

      function postLogin() {
        return _ref6.apply(this, arguments);
      }

      return postLogin;
    }()
  }, {
    key: 'authorize',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var response, location;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.get(_constants.GITHUB_AUTHORIZE_URL, {
                  client_id: this.config.client,
                  redirect_uri: this.config.callback,
                  state: this.config.state
                });

              case 2:
                response = _context7.sent;
                location = response.headers.location || '';

                // github loged, but need authorize

                if (location) {
                  _context7.next = 10;
                  break;
                }

                _signale2.default.pending('loged && authorize.');
                _context7.next = 8;
                return this.authorizeForm(parseAuthorizeFormData(response.body));

              case 8:
                response = _context7.sent;

                location = response.headers.location || '';

              case 10:

                if (!location.startsWith(this.config.callback)) {
                  _signale2.default.fatal(new Error('authorize failue.'));
                }

                _signale2.default.success('loged && authorize.');
                return _context7.abrupt('return', _queryString2.default.parseUrl(location).query);

              case 13:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function authorize() {
        return _ref7.apply(this, arguments);
      }

      return authorize;
    }()
  }, {
    key: 'login',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!(this.client.cookie.get('logged_in') === 'yes')) {
                  _context8.next = 9;
                  break;
                }

                _context8.prev = 1;
                _context8.next = 4;
                return this.authorize();

              case 4:
                return _context8.abrupt('return', _context8.sent);

              case 7:
                _context8.prev = 7;
                _context8.t0 = _context8['catch'](1);

              case 9:
                _context8.next = 11;
                return this.postLogin();

              case 11:
                _context8.next = 13;
                return this.authorize();

              case 13:
                return _context8.abrupt('return', _context8.sent);

              case 14:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[1, 7]]);
      }));

      function login() {
        return _ref8.apply(this, arguments);
      }

      return login;
    }()
  }]);
  return GithubLogin;
}();

exports.default = GithubLogin;
module.exports = exports['default'];

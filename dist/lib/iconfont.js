'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var _githubLogin = require('./github-login.js');

var _githubLogin2 = _interopRequireDefault(_githubLogin);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jszip = require('jszip');

var _jszip2 = _interopRequireDefault(_jszip);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GITHUB_ORIGIN = 'https://github.com';
var GITHUB_AUTHORIZE_URL = '/login/oauth/authorize';

var ICONFONT_ORIGIN = 'http://iconfont.cn';
var ICONFONT_GITHUB_CALLBACK_URL = '/api/login/github/callback';
var ICONFONT_GITHUB_LOGIN_URL = '/api/login/github';
var ICONFONT_DETAIL_URL = '/api/project/detail.json';
var ICONFONT_UPDATE_URL = '/api/project/cdn.json';
var ICONFONT_DOWNLOAD_URL = '/api/project/download.zip';

var Iconfont = function () {
  function Iconfont(config) {
    (0, _classCallCheck3.default)(this, Iconfont);

    this.config = config;
    this.request = new _request2.default('iconfont');
  }

  (0, _createClass3.default)(Iconfont, [{
    key: 'getToken',
    value: function getToken() {
      return this.request.cookie.get('ctoken');
    }
  }, {
    key: 'getProjetInfo',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.request.request(ICONFONT_DETAIL_URL, {
                  query: {
                    pid: this.config.project,
                    ctoken: this.getToken()
                  }
                }).then(function (response) {
                  if (response.headers.location && response.headers.location.includes('err.taobao.com')) {
                    return null;
                  }

                  try {
                    var data = JSON.parse(response.body);
                    if (data && data.code === 200) {
                      return data.data;
                    }
                  } catch (err) {
                    return null;
                  }

                  return null;
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getProjetInfo() {
        return _ref.apply(this, arguments);
      }

      return getProjetInfo;
    }()
  }, {
    key: 'login',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var response, location, github, data;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                response = void 0;
                location = void 0;

                console.log('login to iconfont');

                _context2.next = 5;
                return this.request.request(ICONFONT_GITHUB_LOGIN_URL);

              case 5:
                response = _context2.sent;

                location = response.headers.location || '';

                if (location.startsWith(GITHUB_ORIGIN + GITHUB_AUTHORIZE_URL)) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt('return', false);

              case 9:
                github = new _githubLogin2.default(this.config.user.account, this.config.user.password);


                console.log('login to github');
                _context2.next = 13;
                return github.login(_queryString2.default.parseUrl(location).query);

              case 13:
                data = _context2.sent;

                if (data) {
                  _context2.next = 16;
                  break;
                }

                return _context2.abrupt('return', false);

              case 16:
                _context2.next = 18;
                return this.request.request(ICONFONT_GITHUB_CALLBACK_URL, {
                  query: data
                });

              case 18:
                response = _context2.sent;
                return _context2.abrupt('return', response);

              case 20:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function login() {
        return _ref2.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: 'info',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var loginResult;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.getProjetInfo();

              case 2:
                this.project = _context3.sent;

                if (this.project) {
                  _context3.next = 12;
                  break;
                }

                _context3.next = 6;
                return this.login();

              case 6:
                loginResult = _context3.sent;

                if (loginResult) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt('return', null);

              case 9:
                _context3.next = 11;
                return this.getProjetInfo();

              case 11:
                this.project = _context3.sent;

              case 12:
                return _context3.abrupt('return', this.project);

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function info() {
        return _ref3.apply(this, arguments);
      }

      return info;
    }()
  }, {
    key: 'update',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var response, location, project;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                response = void 0;
                location = void 0;
                project = this.project;


                console.log('[iconfont] update project.');

                _context4.next = 6;
                return this.request.request(ICONFONT_UPDATE_URL, {
                  form: true,
                  body: {
                    pid: this.config.project,
                    ctoken: this.getToken()
                  },
                  json: true
                }).then(function (response) {
                  var data = response.body;
                  if (!data || data.code !== 200) {
                    throw new Error('[iconfont] update failue.');
                  }

                  (0, _keys2.default)(data.data).forEach(function (name) {
                    project.font[name] = project.font[name].replace(/font_\d+_.*?\./, data.data[name] + '.');
                  });
                });

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function update() {
        return _ref4.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'download',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var store, versionFile, version, cdnVersion, response, body, zip, promises;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                store = _path2.default.join(process.cwd(), this.config.store, 'iconfont-' + this.config.project);

                (0, _mkdirp2.default)(store);

                versionFile = _path2.default.join(store, '.version');
                version = '';
                cdnVersion = '';


                try {
                  version = _fs2.default.readFileSync(versionFile);
                } catch (err) {}

                try {
                  cdnVersion = this.project.font.css_file.match(/font_\d+_(.*?)\./)[1];
                } catch (err) {}

                if (!(version && cdnVersion === version)) {
                  _context5.next = 9;
                  break;
                }

                return _context5.abrupt('return');

              case 9:

                console.log('[iconfont downloading files]');
                _context5.next = 12;
                return this.request.request(ICONFONT_DOWNLOAD_URL, {
                  query: {
                    pid: this.config.project,
                    ctoken: this.getToken()
                  },
                  encoding: null
                });

              case 12:
                response = _context5.sent;
                body = response.body;
                zip = new _jszip2.default();
                _context5.next = 17;
                return zip.loadAsync(body);

              case 17:
                promises = (0, _keys2.default)(zip.files).map(function (path) {
                  return zip.files[path];
                }).filter(function (file) {
                  return !file.dir;
                }).map(function (file) {
                  return file.async('nodebuffer').then(function (buffer) {
                    _fs2.default.writeFileSync(_path2.default.join(store, file.name.split('/').pop()), buffer);
                  });
                });
                _context5.next = 20;
                return _promise2.default.all(promises);

              case 20:

                _fs2.default.writeFileSync(versionFile, cdnVersion);

              case 21:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function download() {
        return _ref5.apply(this, arguments);
      }

      return download;
    }()
  }]);
  return Iconfont;
}();

exports.default = Iconfont;
module.exports = exports['default'];

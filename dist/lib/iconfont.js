'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})

var _promise = require('babel-runtime/core-js/promise')

var _promise2 = _interopRequireDefault(_promise)

var _keys = require('babel-runtime/core-js/object/keys')

var _keys2 = _interopRequireDefault(_keys)

var _typeof2 = require('babel-runtime/helpers/typeof')

var _typeof3 = _interopRequireDefault(_typeof2)

var _assign = require('babel-runtime/core-js/object/assign')

var _assign2 = _interopRequireDefault(_assign)

var _regenerator = require('babel-runtime/regenerator')

var _regenerator2 = _interopRequireDefault(_regenerator)

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator')

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2)

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck')

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2)

var _createClass2 = require('babel-runtime/helpers/createClass')

var _createClass3 = _interopRequireDefault(_createClass2)

var _request = require('./request.js')

var _request2 = _interopRequireDefault(_request)

var _queryString = require('query-string')

var _queryString2 = _interopRequireDefault(_queryString)

var _githubLogin = require('./github-login.js')

var _githubLogin2 = _interopRequireDefault(_githubLogin)

var _signale = require('./signale.js')

var _signale2 = _interopRequireDefault(_signale)

var _path = require('path')

var _path2 = _interopRequireDefault(_path)

var _fs = require('fs')

var _fs2 = _interopRequireDefault(_fs)

var _jszip = require('jszip')

var _jszip2 = _interopRequireDefault(_jszip)

var _mkdirp = require('mkdirp')

var _mkdirp2 = _interopRequireDefault(_mkdirp)

var _debug = require('debug')

var _debug2 = _interopRequireDefault(_debug)

var _constants = require('../constants.js')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

var Iconfont = (function() {
  function Iconfont(config) {
    ;(0, _classCallCheck3.default)(this, Iconfont)

    this.config = config
    this.client = new _request2.default({
      origin: _constants.ICONFONT_ORIGIN,
      key: config.user,
    })
    this.token = this.client.cookie.get('ctoken')
  }

  ;(0, _createClass3.default)(Iconfont, [
    {
      key: 'request',
      value: (function() {
        var _ref = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee(
            path,
            options
          ) {
            var response, data
            return _regenerator2.default.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      _context.next = 2
                      return this.client.request(path, options)

                    case 2:
                      response = _context.sent

                      this.token = this.client.cookie.get('ctoken')

                      if (options.json) {
                        _context.next = 6
                        break
                      }

                      return _context.abrupt('return', response)

                    case 6:
                      data = response.body

                      if (!(!data || data.code !== 200)) {
                        _context.next = 9
                        break
                      }

                      throw new Error((data && data.message) || 'error')

                    case 9:
                      return _context.abrupt('return', data.data)

                    case 10:
                    case 'end':
                      return _context.stop()
                  }
                }
              },
              _callee,
              this
            )
          })
        )

        function request(_x, _x2) {
          return _ref.apply(this, arguments)
        }

        return request
      })(),
    },
    {
      key: 'post',
      value: (function() {
        var _ref2 = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee2(
            path,
            data
          ) {
            var options
            return _regenerator2.default.wrap(
              function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      options = {
                        json: data === true,
                        form: true,
                        body: (0, _assign2.default)(
                          this.projectData,
                          (typeof data === 'undefined'
                            ? 'undefined'
                            : (0, _typeof3.default)(data)) === 'object'
                            ? data
                            : {}
                        ),
                      }
                      _context2.next = 3
                      return this.request(path, options)

                    case 3:
                      return _context2.abrupt('return', _context2.sent)

                    case 4:
                    case 'end':
                      return _context2.stop()
                  }
                }
              },
              _callee2,
              this
            )
          })
        )

        function post(_x3, _x4) {
          return _ref2.apply(this, arguments)
        }

        return post
      })(),
    },
    {
      key: 'get',
      value: (function() {
        var _ref3 = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee3(
            path,
            data
          ) {
            var options
            return _regenerator2.default.wrap(
              function _callee3$(_context3) {
                while (1) {
                  switch ((_context3.prev = _context3.next)) {
                    case 0:
                      options = {
                        json: data === true,
                        query: (0, _assign2.default)(
                          this.projectData,
                          (typeof data === 'undefined'
                            ? 'undefined'
                            : (0, _typeof3.default)(data)) === 'object'
                            ? data
                            : {}
                        ),
                      }
                      _context3.next = 3
                      return this.request(path, options)

                    case 3:
                      return _context3.abrupt('return', _context3.sent)

                    case 4:
                    case 'end':
                      return _context3.stop()
                  }
                }
              },
              _callee3,
              this
            )
          })
        )

        function get(_x5, _x6) {
          return _ref3.apply(this, arguments)
        }

        return get
      })(),
    },
    {
      key: 'login',
      value: (function() {
        var _ref4 = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee4() {
            var response, location, github, githubData
            return _regenerator2.default.wrap(
              function _callee4$(_context4) {
                while (1) {
                  switch ((_context4.prev = _context4.next)) {
                    case 0:
                      response = void 0
                      location = void 0

                      if (this.token) {
                        _context4.next = 7
                        break
                      }

                      _context4.next = 5
                      return this.get(_constants.ICONFONT_GITHUB_LOGIN_URL)

                    case 5:
                      if (this.token) {
                        _context4.next = 7
                        break
                      }

                      throw new Error('iconfont login failue.')

                    case 7:
                      _signale2.default.pending('login with github account')

                      github = new _githubLogin2.default({
                        client: _constants.ICONFONT_GITHUB_CLIENT,
                        callback:
                          _constants.ICONFONT_ORIGIN +
                          _constants.ICONFONT_GITHUB_CALLBACK_URL,
                        account: this.config.user.account,
                        password: this.config.user.password,
                        state: _constants.ICONFONT_GITHUB_STATE,
                      })
                      _context4.next = 11
                      return github.login()

                    case 11:
                      githubData = _context4.sent
                      _context4.next = 14
                      return this.request(
                        _constants.ICONFONT_GITHUB_CALLBACK_URL,
                        {
                          query: (0, _assign2.default)(
                            {
                              state: _constants.ICONFONT_GITHUB_STATE,
                            },
                            githubData
                          ),
                        }
                      )

                    case 14:
                    case 'end':
                      return _context4.stop()
                  }
                }
              },
              _callee4,
              this
            )
          })
        )

        function login() {
          return _ref4.apply(this, arguments)
        }

        return login
      })(),
    },
    {
      key: 'info',
      value: (function() {
        var _ref5 = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee5() {
            var project
            return _regenerator2.default.wrap(
              function _callee5$(_context5) {
                while (1) {
                  switch ((_context5.prev = _context5.next)) {
                    case 0:
                      project = void 0

                      if (!this.token) {
                        _context5.next = 11
                        break
                      }

                      _context5.prev = 2
                      _context5.next = 5
                      return this.get(_constants.ICONFONT_DETAIL_URL, true)

                    case 5:
                      project = _context5.sent
                      _context5.next = 11
                      break

                    case 8:
                      _context5.prev = 8
                      _context5.t0 = _context5['catch'](2)

                      _signale2.default.fatal(_context5.t0)

                    case 11:
                      if (!(!project || !this.token)) {
                        _context5.next = 17
                        break
                      }

                      _context5.next = 14
                      return this.login()

                    case 14:
                      _context5.next = 16
                      return this.get(_constants.ICONFONT_DETAIL_URL, true)

                    case 16:
                      project = _context5.sent

                    case 17:
                      return _context5.abrupt(
                        'return',
                        (this.project = project)
                      )

                    case 18:
                    case 'end':
                      return _context5.stop()
                  }
                }
              },
              _callee5,
              this,
              [[2, 8]]
            )
          })
        )

        function info() {
          return _ref5.apply(this, arguments)
        }

        return info
      })(),
    },
    {
      key: 'update',
      value: (function() {
        var _ref6 = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee6() {
            var project, info
            return _regenerator2.default.wrap(
              function _callee6$(_context6) {
                while (1) {
                  switch ((_context6.prev = _context6.next)) {
                    case 0:
                      project = this.project

                      _signale2.default.pending('update project.')

                      _context6.next = 4
                      return this.post(_constants.ICONFONT_UPDATE_URL, true)

                    case 4:
                      info = _context6.sent

                      ;(0, _keys2.default)(info).forEach(function(name) {
                        project.font[name] = project.font[name].replace(
                          /font_\d+_.*?\./,
                          info[name] + '.'
                        )
                      })

                      _signale2.default.success('update project complete.')

                    case 7:
                    case 'end':
                      return _context6.stop()
                  }
                }
              },
              _callee6,
              this
            )
          })
        )

        function update() {
          return _ref6.apply(this, arguments)
        }

        return update
      })(),
    },
    {
      key: 'download',
      value: (function() {
        var _ref7 = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee7() {
            var store,
              versionFile,
              version,
              cdnVersion,
              response,
              body,
              zip,
              promises
            return _regenerator2.default.wrap(
              function _callee7$(_context7) {
                while (1) {
                  switch ((_context7.prev = _context7.next)) {
                    case 0:
                      store = _path2.default.join(
                        process.cwd(),
                        this.config.store,
                        'font-' + this.config.project
                      )

                      ;(0, _mkdirp2.default)(store)

                      versionFile = _path2.default.join(store, '.version')
                      version = ''
                      cdnVersion = ''

                      try {
                        version = _fs2.default
                          .readFileSync(versionFile, _constants.CHARSET)
                          .trim()
                      } catch (err) {}

                      try {
                        cdnVersion = this.project.font.css_file.match(
                          /font_\d+_(.*?)\./
                        )[1]
                      } catch (err) {}

                      if (!(version && cdnVersion === version)) {
                        _context7.next = 10
                        break
                      }

                      debug('cache is up to date, version ' + cdnVersion + '.')
                      return _context7.abrupt('return')

                    case 10:
                      _signale2.default.pending('download files from cdn.')
                      _context7.next = 13
                      return this.request(_constants.ICONFONT_DOWNLOAD_URL, {
                        query: this.projectData,
                        encoding: null,
                      })

                    case 13:
                      response = _context7.sent
                      body = response.body
                      zip = new _jszip2.default()
                      _context7.next = 18
                      return zip.loadAsync(body)

                    case 18:
                      promises = (0, _keys2.default)(zip.files)
                        .map(function(path) {
                          return zip.files[path]
                        })
                        .filter(function(file) {
                          return !file.dir
                        })
                        .map(function(file) {
                          var fileName = file.name.split('/').pop()
                          // debug(`saving ${fileName} to ${store} .`)
                          _signale2.default.pending(
                            'file ' + fileName + ' saved.'
                          )
                          return file
                            .async('nodebuffer')
                            .then(function(buffer) {
                              _fs2.default.writeFileSync(
                                _path2.default.join(store, fileName),
                                buffer
                              )
                            })
                        })
                      _context7.next = 21
                      return _promise2.default.all(promises)

                    case 21:
                      _fs2.default.writeFileSync(
                        versionFile,
                        cdnVersion,
                        _constants.CHARSET
                      )
                      _signale2.default.success(
                        'update to version ' + cdnVersion + ' complated.'
                      )

                    case 23:
                    case 'end':
                      return _context7.stop()
                  }
                }
              },
              _callee7,
              this
            )
          })
        )

        function download() {
          return _ref7.apply(this, arguments)
        }

        return download
      })(),
    },
    {
      key: 'projectData',
      get: function get() {
        return {
          pid: this.config.project,
          ctoken: this.token,
        }
      },
    },
  ])
  return Iconfont
})()

exports.default = Iconfont
module.exports = exports['default']

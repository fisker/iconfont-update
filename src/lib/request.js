import got from 'got'
import Cookie from './cookie.js'

const sites = {
  github: {
    origin: 'https://github.com'
  },
  iconfont: {
    origin: 'http://iconfont.cn'
  },
}

function updateCookie(cookie, response) {
  var cookies = response.headers['set-cookie'] || []
  cookies = Array.isArray(cookies) ? cookies : [cookies]

  cookies.forEach(function(str) {
    cookie.parse(str)
  })

  return response
}

export default class Request {
  constructor(siteName) {
    const site = sites[siteName]
    this.siteName = siteName
    this.origin = site.origin
    this.cookie = new Cookie(siteName)
  }

  request(path, options) {
    options = Object.assign({}, {
      headers: {
        cookie: this.cookie.serialize()
      },
      followRedirect: false,
      throwHttpErrors: false,
    }, options)

    return got(`${this.origin}${path}`, options)
      .then(response => updateCookie(this.cookie, response))
  }
}

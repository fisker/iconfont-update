import got from 'got'
import Cookie from './cookie.js'

import {
  ICONFONT_ORIGIN,
  GITHUB_ORIGIN,
} from '../constants.js'

function updateCookie(cookie, response) {
  var cookies = response.headers['set-cookie'] || []
  cookies = Array.isArray(cookies) ? cookies : [cookies]

  cookies.forEach(function(str) {
    cookie.parse(str)
  })

  return response
}

export default class Request {
  constructor(config) {
    this.origin = config.origin
    this.cookie = new Cookie(config.key)
  }

  async request(path, options) {
    options = Object.assign({}, {
      headers: {
        cookie: this.cookie.serialize()
      },
      followRedirect: false,
      throwHttpErrors: false,
    }, options)

    // console.log(`[request] ${this.origin}${path} \n ${JSON.stringify(options, null, 2)}`)

    let response = await got(`${this.origin}${path}`, options)

    updateCookie(this.cookie, response)

    // console.log(response.headers, response.body)

    return response
  }
}

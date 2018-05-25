import Request from './request.js'
import queryString from 'query-string'
import debugPkg from 'debug'

import {
  GITHUB_ORIGIN,
  GITHUB_AUTHORIZE_URL,
  GITHUB_LOGIN_URL,
  GITHUB_SESSION_URL
} from '../constants.js'

const debug = debugPkg('github')

function parseAuthorizeFormData(body) {
  let re = /<input(?:.*?)name="(.*?)"(?:.*?)value="(.*?)"(?:.*?)>/g
  const data = {}
  let result
  while ((result = re.exec(body))) {
    data[result[1]] = result[2]
  }

  return data
}

export default class GithubLogin {
  constructor(config) {
    this.config = config
    this.client = new Request({
      origin: GITHUB_ORIGIN,
      key: config
    })
  }

  async request(path, options) {
    return await this.client.request(path, options)
  }

  async get(path, data) {
    return await this.client.request(path, {
      query: data
    })
  }

  async post(path, data) {
    return await this.client.request(path, {
      body: data,
      form: true
    })
  }

  async authorizeForm(data) {
    debug('loged, but need authorize.')

    data.authorize = 1
    data.state = this.config.state

    return await this.request(GITHUB_AUTHORIZE_URL, {
      query: {
        client_id: this.config.client,
        redirect_uri: this.config.callback,
        state: this.config.state
      },
      form: true,
      body: data
    })
  }

  async getAuthenticityToken() {
    let authData = {
      client_id: this.config.client,
      redirect_uri: this.config.callback,
      state: this.config.state
    }

    let data = {
      client_id: this.config.client,
      return_to: `${GITHUB_AUTHORIZE_URL}?${queryString.stringify(authData)}`
    }

    debug('open login form.')
    let response = await this.get(GITHUB_LOGIN_URL, data)

    return response.body.match(
      /<input(?:.*?)name="authenticity_token"(?:.*?)value="(.*?)"(?:.*?)>/
    )[1]
  }

  async postLogin() {
    let response

    let authenticityToken
    try {
      authenticityToken = await this.getAuthenticityToken()
    } catch (err) {
      throw new Error('get authenticity_token failue.')
    }

    debug('posting login data.')

    await this.request(GITHUB_SESSION_URL, {
      form: true,
      body: {
        login: this.config.account,
        password: this.config.password,
        authenticity_token: authenticityToken
      }
    })

    if (this.client.cookie.get('logged_in') !== 'yes') {
      throw new Error('github login failue.')
    }
  }

  async authorize() {
    let response = await this.get(GITHUB_AUTHORIZE_URL, {
      client_id: this.config.client,
      redirect_uri: this.config.callback,
      state: this.config.state
    })

    let location = response.headers.location || ''

    // github loged, but need authorize
    if (!location) {
      debug('loged && authorize.')
      response = await this.authorizeForm(parseAuthorizeFormData(response.body))
      location = response.headers.location || ''
    }

    if (!location.startsWith(this.config.callback)) {
      throw new Error('authorize failue.')
    }

    debug('loged && authorized.')
    return queryString.parseUrl(location).query
  }

  async login() {
    if (this.client.cookie.get('logged_in') === 'yes') {
      try {
        return await this.authorize()
      } catch (err) {}
    }

    await this.postLogin()

    return await this.authorize()
  }
}

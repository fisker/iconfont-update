import Request from './request.js'
import queryString from 'query-string'

const ICONFONT_ORIGIN = 'http://iconfont.cn'
const ICONFONT_GITHUB_CALLBACK_URL = '/api/login/github/callback'

const GITHUB_ORIGIN = 'https://github.com'
const GITHUB_AUTHORIZE_URL = '/login/oauth/authorize'
const GITHUB_LOGIN_URL = '/login'
const GITHUB_SESSION_URL = '/session'

function parseAuthorizeData(body) {
  let re = /<input(?:.*?)name="(.*?)"(?:.*?)value="(.*?)"(?:.*?)>/g
  const data = {}
  let result
  while(result = re.exec(body)) {
    data[result[1]] = result[2]
  }

  return data
}

export default class GithubLogin {
  constructor(account, password) {
    this.account = account
    this.password = password
    this.request = new Request('github')
  }

  async authorize(data) {
    console.log('[github] loged, but need authorize')

    return await this.request.request(GITHUB_AUTHORIZE_URL, {
      form: true,
      body: data
    })
  }

  async postLogin(data) {

    let response

    console.log('[github] opening login form')
    response = await this.request.request(GITHUB_LOGIN_URL, {
      query: data
    })

    let authenticityToken = response.body.match(/<input(?:.*?)name="authenticity_token"(?:.*?)value="(.*?)"(?:.*?)>/)[1]
    if (!authenticityToken) {
      return false
    }

    console.log('[github] posting login data')


    response = await this.request.request(GITHUB_SESSION_URL, {
      query: data,
      form: true,
      body: {
        login: this.account,
        password: this.password,
        authenticity_token: authenticityToken
      }
    })

    return response
  }

  async login(data) {
    let response
    let location

    response = await this.request.request(GITHUB_AUTHORIZE_URL, {
      query: data
    })

    location = response.headers.location || ''

    // github loged, but need authorize
    if (!location) {
      response = await this.authorize(parseAuthorizeData(response.body))
      location = response.headers.location || ''
    }

    // github loged && authorized
    if (location.startsWith(ICONFONT_ORIGIN + ICONFONT_GITHUB_CALLBACK_URL)) {
      console.log('[github] loged && authorized')
      return queryString.parseUrl(location).query
    }


    if (!location.startsWith(GITHUB_ORIGIN + GITHUB_LOGIN_URL)) {
      return false
    }

    response = await this.postLogin(queryString.parseUrl(location).query)

    if (!response) {
      return false
    }

    location = response.headers.location || ''

    if (!location.startsWith(GITHUB_ORIGIN + GITHUB_AUTHORIZE_URL)) {
      return false
    }

    console.log('[github] authorize')
    response = await this.request.request(GITHUB_AUTHORIZE_URL, {
      query: queryString.parseUrl(location).query
    })
    location = response.headers.location || ''

    // github loged && authorized
    if (location.startsWith(ICONFONT_ORIGIN + ICONFONT_GITHUB_CALLBACK_URL)) {
      return queryString.parseUrl(location).query
    }
  }
}

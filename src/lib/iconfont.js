import Request from './request.js'
import queryString from 'query-string'
import GithubLogin from './github-login.js'
import path from 'path'
import fs from 'fs'
import JSZip from 'jszip'
import mkdirp from 'mkdirp'

const GITHUB_ORIGIN = 'https://github.com'
const GITHUB_AUTHORIZE_URL = '/login/oauth/authorize'

const ICONFONT_ORIGIN = 'http://iconfont.cn'
const ICONFONT_GITHUB_CALLBACK_URL = '/api/login/github/callback'
const ICONFONT_GITHUB_LOGIN_URL = '/api/login/github'
const ICONFONT_DETAIL_URL = '/api/project/detail.json'
const ICONFONT_UPDATE_URL = '/api/project/cdn.json'
const ICONFONT_DOWNLOAD_URL = '/api/project/download.zip'


export default class Iconfont {
  constructor(config) {
    this.config = config
    this.request = new Request('iconfont')
  }

  getToken() {
    return this.request.cookie.get('ctoken')
  }

  async getProjetInfo() {
    return this.request.request(ICONFONT_DETAIL_URL, {
      query: {
        pid: this.config.project,
        ctoken: this.getToken()
      }
    }).then(function (response) {
      if (response.headers.location && response.headers.location.includes('err.taobao.com')) {
        return null
      }

      try {
        var data = JSON.parse(response.body)
        if (data && data.code === 200) {
          return data.data
        }
      } catch (err) {
        return null
      }

      return null
    })
  }

  async login() {
    let response
    let location
    console.log('login to iconfont')

    response = await this.request.request(ICONFONT_GITHUB_LOGIN_URL)
    location = response.headers.location || ''

    if (!location.startsWith(GITHUB_ORIGIN + GITHUB_AUTHORIZE_URL)) {
      return false
    }

    const github = new GithubLogin(this.config.user.account, this.config.user.password)

    console.log('login to github')
    let data = await github.login(queryString.parseUrl(location).query)

    if (!data) {
      return false
    }

    response = await this.request.request(ICONFONT_GITHUB_CALLBACK_URL, {
      query: data
    })

    return response
  }

  async info() {
    this.project = await this.getProjetInfo()

    if (!this.project) {
      let loginResult = await this.login()

      if (!loginResult) {
        return null
      }

      this.project = await this.getProjetInfo()
    }

    return this.project
  }

  async update() {
    let response
    let location

    const project = this.project

    console.log('[iconfont] update project.')

    await this.request.request(ICONFONT_UPDATE_URL, {
      form: true,
      body: {
        pid: this.config.project,
        ctoken: this.getToken()
      },
      json: true
    }).then(function (response) {
      var data = response.body
      if (!data || data.code !== 200) {
        throw new Error('[iconfont] update failue.')
      }

      Object.keys(data.data).forEach(function (name) {
        project.font[name] = project.font[name].replace(/font_\d+_.*?\./, data.data[name] + '.')
      })
    })
  }

  async download() {
    const store = path.join(process.cwd(), this.config.store, 'iconfont-' + this.config.project)
    mkdirp(store)

    const versionFile = path.join(store, '.version')
    let version = ''
    let cdnVersion = ''

    try {
      version = fs.readFileSync(versionFile)
    } catch (err) {}

    try {
      cdnVersion = this.project.font.css_file.match(/font_\d+_(.*?)\./)[1]
    } catch (err) {}

    if (version && cdnVersion === version) {
      return
    }

    console.log('[iconfont downloading files]')
    let response = await this.request.request(ICONFONT_DOWNLOAD_URL, {
      query: {
        pid: this.config.project,
        ctoken: this.getToken()
      },
      encoding: null
    })

    let body = response.body

    const zip = new JSZip()
    await zip.loadAsync(body)

    let promises = Object.keys(zip.files)
      .map(path => zip.files[path])
      .filter(file => !file.dir)
      .map(function (file) {
        return file.async('nodebuffer').then(function (buffer) {
          fs.writeFileSync(path.join(store, file.name.split('/').pop()), buffer)
        })
      })

    await Promise.all(promises)

    fs.writeFileSync(versionFile, cdnVersion)
  }
}

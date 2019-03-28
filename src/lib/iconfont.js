import path from 'path'
import fs from 'fs'
import JSZip from 'jszip'
import mkdirp from 'mkdirp'
import signale from './signale'
import GithubLogin from './github-login'
import Request from './request'

import {
  CHARSET,
  ICONFONT_ORIGIN,
  ICONFONT_GITHUB_CLIENT,
  ICONFONT_GITHUB_CALLBACK_URL,
  ICONFONT_GITHUB_LOGIN_URL,
  ICONFONT_GITHUB_STATE,
  ICONFONT_DETAIL_URL,
  ICONFONT_UPDATE_URL,
  ICONFONT_DOWNLOAD_URL,
} from '../constants'

export default class Iconfont {
  constructor(config) {
    this.config = config
    this.client = new Request({
      origin: ICONFONT_ORIGIN,
      key: config.user,
    })
    this.token = this.client.cookie.get('ctoken')
  }

  get projectData() {
    return {
      pid: this.config.project,
      ctoken: this.token,
    }
  }

  async request(path, options) {
    const response = await this.client.request(path, options)

    this.token = this.client.cookie.get('ctoken')

    if (!options.json) {
      return response
    }

    const data = response.body

    if (!data || data.code !== 200) {
      throw new Error((data && data.message) || 'error')
    }

    return data.data
  }

  async post(path, data) {
    const options = {
      json: data === true,
      form: true,
      body: Object.assign(
        this.projectData,
        typeof data === 'object' ? data : {}
      ),
    }
    return this.request(path, options)
  }

  async get(path, data) {
    const options = {
      json: data === true,
      query: Object.assign(
        this.projectData,
        typeof data === 'object' ? data : {}
      ),
    }
    return this.request(path, options)
  }

  async login() {
    if (!this.token) {
      await this.get(ICONFONT_GITHUB_LOGIN_URL)

      if (!this.token) {
        throw new Error('iconfont login failue.')
      }
    }

    signale.pending('login with github account')

    const github = new GithubLogin({
      client: ICONFONT_GITHUB_CLIENT,
      callback: ICONFONT_ORIGIN + ICONFONT_GITHUB_CALLBACK_URL,
      account: this.config.user.account,
      password: this.config.user.password,
      state: ICONFONT_GITHUB_STATE,
    })

    const githubData = await github.login()

    await this.request(ICONFONT_GITHUB_CALLBACK_URL, {
      query: Object.assign(
        {
          state: ICONFONT_GITHUB_STATE,
        },
        githubData
      ),
    })
  }

  async info() {
    let project

    if (this.token) {
      try {
        project = await this.get(ICONFONT_DETAIL_URL, true)
      } catch (error) {
        signale.fatal(error)
      }
    }

    if (!project || !this.token) {
      await this.login()
      project = await this.get(ICONFONT_DETAIL_URL, true)
    }

    return (this.project = project)
  }

  async update() {
    const {project} = this

    signale.pending('update project.')

    const info = await this.post(ICONFONT_UPDATE_URL, true)

    Object.keys(info).forEach(function(name) {
      project.font[name] = project.font[name].replace(
        /font_\d+_.*?\./,
        `${info[name]}.`
      )
    })

    signale.success('update project complete.')
  }

  async download() {
    const store = path.join(
      process.cwd(),
      this.config.store,
      `font-${this.config.project}`
    )
    mkdirp(store)

    const versionFile = path.join(store, '.version')
    let version = ''
    let cdnVersion = ''

    try {
      version = fs.readFileSync(versionFile, CHARSET).trim()
    } catch (error) {}

    try {
      cdnVersion = this.project.font.css_file.match(/font_\d+_(.*?)\./)[1]
    } catch (error) {}

    if (version && cdnVersion === version) {
      signale.success(`cache is up to date, version ${cdnVersion}.`)
      return
    }

    signale.pending('download files from cdn.')
    const response = await this.request(ICONFONT_DOWNLOAD_URL, {
      query: this.projectData,
      encoding: null,
    })

    const {body} = response

    const zip = new JSZip()
    await zip.loadAsync(body)

    const promises = Object.keys(zip.files)
      .map(path => zip.files[path])
      .filter(file => !file.dir)
      .map(function(file) {
        const fileName = file.name.split('/').pop()
        // debug(`saving ${fileName} to ${store} .`)
        signale.pending(`file ${fileName} saved.`)
        return file.async('nodebuffer').then(function(buffer) {
          fs.writeFileSync(path.join(store, fileName), buffer)
        })
      })

    await Promise.all(promises)

    fs.writeFileSync(versionFile, cdnVersion, CHARSET)
    signale.success(`update to version ${cdnVersion} complated.`)
  }
}

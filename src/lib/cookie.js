import cookie from 'cookie'

import {name as pkgName} from '../../package.json'
import path from 'path'
import os from 'os'
import fs from 'fs'

const COOKIES_STORE_DIR = path.join(os.tmpdir(), pkgName)

try {
  fs.mkdirSync(COOKIES_STORE_DIR)
} catch (err) {}

export default class Cookie {
  constructor(key) {
    this.storeFile = path.join(COOKIES_STORE_DIR, key + '.cookie.json')
    this.init()
  }

  init() {
    var file = this.storeFile
    try {
      this.data = JSON.parse(fs.readFileSync(file))
    } catch (err) {
      this.data = {}
    }
  }

  parse(str, options) {
    Object.assign(this.data, cookie.parse(str, options))
    fs.writeFileSync(this.storeFile, JSON.stringify(this.data, null, 2))
  }

  serialize(options) {
    return Object.keys(this.data)
      .map(name => cookie.serialize(name, this.data[name], options)).join('; ')
  }

  get(name) {
    return this.data[name]
  }
}

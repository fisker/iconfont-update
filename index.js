var path = require('path')
var fs = require('fs')

var config = {}

try {
  config = require(path.join(process.cwd(), '.iconfontrc'))
} catch (err) {}

if (!config || !config.project) {
  console.error('no config file')
  process.exit(1)
}

require('./dist/index.js')(config)

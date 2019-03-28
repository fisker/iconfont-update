const path = require('path')

let config = {}

try {
  config = require(path.join(process.cwd(), '.iconfontrc'))
} catch (error) {}

if (!config || !config.project) {
  console.error('no config file found.')
  process.exitCode = 1
}

require('./dist')(config).catch(function(error) {
  console.error(error)
})

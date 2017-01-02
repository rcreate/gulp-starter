var path = require('path')
var path = require('fs')
if( typeof process.env.PWD === "undefined" ) {
    var packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'package.json'), 'utf8'));
    var asSubmodule = require('fs').existsSync(path.resolve(process.cwd(), '../../node_modules', packageJson.name))
    process.env.PWD = (asSubmodule ? path.resolve(process.cwd(), '../../') : process.cwd());
}

module.exports = function getConfig() {
  // Use provided object
  if (process.env.GULP_CONFIG) {
    return process.env.GULP_CONFIG
  }

  // Load from path
  if (process.env.GULP_CONFIG_PATH) {
    return require(path.resolve(process.env.PWD, process.env.GULP_CONFIG_PATH))
  }

  try {
    // Default Path
    return require(path.resolve(process.env.PWD, 'build_tools/config.json'))

  } catch(e) {
    // Default
    return require('../config')
  }
}

var config = require('../lib/getConfig')()
var pathJs = require("path")

module.exports = function(path) {
  var dest = config.root.dev;
  if (global.environment === 'production') {
    dest = config.root.dest;
  }
  if (global.environment === 'distribution') {
    dest = config.root.dist;
  }
  return (path ? pathJs.join(dest, path) : dest )
}

var pathJs = require("path")

module.exports = function(path) {
  var dest = GULP_CONFIG.root.dev;
  if (global.environment === 'production') {
    dest = GULP_CONFIG.root.dest;
  }
  if (global.environment === 'distribution') {
    dest = GULP_CONFIG.root.dist;
  }
  return (path ? pathJs.resolve(process.env.PWD, dest, path) : dest )
}

var config = require('../lib/getConfig')()
if(!config.tasks.js) return

var webpackConfig = require('../lib/webpack-multi-config')
var gulp          = require('gulp')
var logger        = require('../lib/compileLogger')
var webpack       = require('webpack')

var webpackDevelopmentTask = function(callback) {
  // skip saving files to filesystem if it's not wanted
  if(
      typeof config.tasks.js.hotModuleReplacement === "undefined"
      ||
      config.tasks.js.hotModuleReplacement === true
  ) {
    if(callback) {
      callback()
    }

    return
  }

  webpack(webpackConfig(global.environment), function(err, stats) {
    if( stats.compilation.errors.length ) {
      logger(err, stats)
    }
    if(callback) {
      callback()
    }
  })
}

gulp.task('webpack:development', webpackDevelopmentTask)
module.exports = webpackDevelopmentTask

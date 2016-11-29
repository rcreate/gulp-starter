if(!GULP_CONFIG.tasks.js) return

var gulp          = require('gulp')
var logger        = require('../lib/compileLogger')
var webpack       = require('webpack')

var webpackDevelopmentTask = function(callback) {

  var webpackConfig = require('../lib/webpack-multi-config')(global.environment)

  // skip saving files to filesystem if it's not wanted
  if(
      (
          typeof GULP_CONFIG.tasks.js.hotModuleReplacement === "undefined"
          ||
          GULP_CONFIG.tasks.js.hotModuleReplacement === true
      )
      &&
      typeof GULP_CONFIG.tasks.browserSync !== "undefined"
  ) {
    if(callback) {
      callback()
    }

    return
  }

  webpack(webpackConfig, function(err, stats) {
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

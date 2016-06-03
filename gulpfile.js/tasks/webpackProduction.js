var config = require('../lib/getConfig')()
if(!config.tasks.js) return

var webpackConfig = require('../lib/webpack-multi-config')
var gulp          = require('gulp')
var logger        = require('../lib/compileLogger')
var webpack       = require('webpack')

var webpackProductionTask = function(callback) {
  webpack(webpackConfig(global.environment), function(err, stats) {
    logger(err, stats)
    callback()
  })
}

gulp.task('webpack:production', webpackProductionTask)
module.exports = webpackProductionTask

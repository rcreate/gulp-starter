var compress = require('compression')
var config   = require('../lib/getConfig')()
var dest   = require('../lib/dest')
var express  = require('express')
var gulp     = require('gulp')
var gutil    = require('gulp-util')
var logger   = require('morgan')
var open     = require('open')
var path     = require('path')

var serverTask = function() {
  var settings = {
    root: path.resolve(process.cwd(), dest()),
    port: process.env.PORT || 5000,
    logLevel: process.env.NODE_ENV ? 'combined' : 'dev',
    staticOptions: {
      extensions: ['html'],
      maxAge: '31556926'
    }
  }
  var url = 'http://localhost:' + settings.port

  express()
    .use(compress())
    .use(logger(settings.logLevel))
    .use('/', express.static(settings.root, settings.staticOptions))
    .listen(settings.port)

  gutil.log('server started on ' + gutil.colors.green(url))

  var browserConfig = ( config.tasks.server.browser && config.tasks.server.browser !== false );
  if( !config.tasks.server || ( config.tasks.server.browser && config.tasks.server.browser !== false ) ) {
    if( browserConfig && typeof config.tasks.server.browser === "string" ) {
      open(url, config.tasks.server.browser)
    } else {
      open(url)
    }
  }
}

var runServerTask = function (env) {
  global.environment = env
  serverTask()
}

gulp.task('server', function() { runServerTask('development') })
gulp.task('server:development', function() { runServerTask('development') })
gulp.task('server:production', function() { runServerTask('production') })
gulp.task('server:distribution', function() { runServerTask('distribution') })
module.exports = serverTask

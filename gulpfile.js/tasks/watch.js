var config = require('../lib/getConfig')()
var gulp   = require('gulp')
var path   = require('path')
var watch  = require('gulp-watch')

var watchTask = function() {
  var watchableTasks = ['fonts', 'iconFont', 'images', 'svgSprite', 'html', 'jade', 'pug', 'css', 'js']

  watchableTasks.forEach(function(taskName) {
    var task = config.tasks[taskName]
    if(task) {
      if(taskName === 'js') {
        taskName = global.environment === 'development' ? 'webpackDevelopment' : 'webpackProduction'
      }

      var glob = path.join(config.root.src, task.src, '**/*.{' + task.extensions.join(',') + '}')
      watch(glob, function() {
        require('./' + taskName)()
        console.info("task "+taskName+" completed")
      })
    }
  })
}

var preTasks = []
if (typeof config.tasks.browserSync !== "undefined") {
  preTasks.push('browserSync')
} else {
  console.info("BrowserSync must be configured in your config.json file to watch changes in your Browser")
}

gulp.task('watch', preTasks, watchTask)
module.exports = watchTask

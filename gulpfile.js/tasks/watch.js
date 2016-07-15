var gulp   = require('gulp')
var path   = require('path')
var watch  = require('gulp-watch')

var watchTask = function() {
  var watchableTasks = ['fonts', 'iconFont', 'images', 'svgSprite', 'html', 'jade', 'css', 'js']

  watchableTasks.forEach(function(taskName) {
    var task = GULP_CONFIG.tasks[taskName]
    if(task) {
      if(taskName === 'js') {
        taskName = global.environment === 'development' ? 'webpackDevelopment' : 'webpackProduction'
      }

      var glob = path.resolve(process.env.PWD, GULP_CONFIG.root.src, task.src, '**/*.{' + task.extensions.join(',') + '}')
      watch(glob, function() {
        require('./' + taskName)()
      })
    }
  })
}

gulp.task('watch', ['browserSync'], watchTask)
module.exports = watchTask

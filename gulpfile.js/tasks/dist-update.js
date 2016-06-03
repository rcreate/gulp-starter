var config       = require('../lib/getConfig')()
var gulp         = require('gulp')
var gulpSequence = require('gulp-sequence')
var getEnabledTasks = require('../lib/getEnabledTasks')

var distUpdateTask = function(cb) {
  global.environment = 'distribution'
  var tasks = getEnabledTasks()
  gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, config.tasks.production.rev ? 'rev': false, 'size-report', 'static', cb)
}

gulp.task('dist-update', distUpdateTask)

module.exports = distUpdateTask

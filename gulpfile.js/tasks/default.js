var gulp            = require('gulp')
var gulpSequence    = require('gulp-sequence')
var getEnabledTasks = require('../lib/getEnabledTasks')

var defaultTask = function(cb) {
  global.environment = 'development'
  var tasks = getEnabledTasks()
  gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, 'static', 'watch', cb)
}

gulp.task('default', defaultTask)
module.exports = defaultTask

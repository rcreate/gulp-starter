var config       = require('../lib/getConfig')()
var gulp         = require('gulp')
var gulpSequence = require('gulp-sequence')
var getEnabledTasks = require('../lib/getEnabledTasks')

var productionTask = function(cb) {
  global.environment = 'production'
  var tasks = getEnabledTasks()
  gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, config.tasks.production.rev ? 'rev': false, 'size-report', 'static', cb)
}

gulp.task('production', productionTask)

module.exports = productionTask

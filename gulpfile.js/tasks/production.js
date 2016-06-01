var config       = require('../lib/getConfig')()
var gulp         = require('gulp')
var gulpSequence = require('gulp-sequence')
var getEnabledTasks = require('../lib/getEnabledTasks')

var productionTask = function(cb) {
  global.production = true
  var tasks = getEnabledTasks('production')
  gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, config.tasks.production.rev ? 'rev': false, 'size-report', 'static', 'bump', 'git:add', 'git:commit','git:tag', cb)
}

var demoTask = function(cb) {
  global.production = true
  var tasks = getEnabledTasks('production')
  gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, config.tasks.production.rev ? 'rev': false, 'size-report', 'static', cb)
}

gulp.task('production', productionTask)
gulp.task('demo', demoTask)

module.exports = productionTask

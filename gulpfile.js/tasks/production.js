var gulp            = require('gulp')
var gulpSequence    = require('gulp-sequence')
var option = require('../lib/option')(GULP_CONFIG)
var getEnabledTasks = require('../lib/getEnabledTasks')
var os              = require('os')
var path            = require('path')

var productionTask = function(cb) {
  global.environment = 'production'

  GULP_CONFIG.root.finalDest = GULP_CONFIG.root.dest
  GULP_CONFIG.root.dest = path.join(os.tmpdir(), 'gulp-starter')

  var sequence = []
  var tasks = getEnabledTasks()

  // clean if neccessary
  if (!option.exists('cleanFirst') || option.get('cleanFirst') === true) {
    sequence.push('clean')
  }

  // push enabled tasks
  if( tasks.assetTasks.length ) {
    sequence.push(tasks.assetTasks)
  }
  if( tasks.codeTasks.length ) {
    sequence.push(tasks.codeTasks)
  }

  // revisioning enabled?
  if (GULP_CONFIG.tasks.production && GULP_CONFIG.tasks.production.rev) {
    sequence.push('rev')
  }

  // static file copy
  if (config.tasks.static) {
    sequence.push('static')
  }

  sequence.push('replaceFiles')

  // generate size report in console?
  if (option.get('reportSizes') === true) {
    sequence.push('size-report')
  }

  // watching and callback
  if (( !option.exists('watch') || option.get('watch') === true ) && option.get('watchProduction')) {
    sequence.push('watch')
  }
  sequence.push(cb)

  // run sequnce
  gulpSequence.apply(this, sequence)
}

gulp.task('production', productionTask)

module.exports = productionTask

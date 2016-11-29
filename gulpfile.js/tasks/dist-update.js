var option = require('../lib/option')(GULP_CONFIG)
var gulp = require('gulp')
var gulpSequence = require('gulp-sequence')
var getEnabledTasks = require('../lib/getEnabledTasks')

var distUpdateTask = function (cb) {
    global.environment = 'distribution'
    var tasks = getEnabledTasks()
    var sequence = []

    // clean if neccessary
    if (!option.exists('cleanFirst') || option.get('cleanFirst') === true) {
        sequence.push('clean')
    }

    // push enabled tasks
    if (tasks.assetTasks.length) {
        sequence.push(tasks.assetTasks)
    }
    if (tasks.codeTasks.length) {
        sequence.push(tasks.codeTasks)
    }

    // revisioning enabled?
    if (GULP_CONFIG.tasks.production && GULP_CONFIG.tasks.production.rev) {
        sequence.push('rev')
    }

    // static file copy
    if (GULP_CONFIG.tasks.static) {
        sequence.push('static')
    }

    // generate size report in console?
    if (option.get('reportSizes') === true) {
        sequence.push('size-report')
    }
    sequence.push(cb)

    // run sequnce
    gulpSequence.apply(this, sequence)
}

gulp.task('dist-update', distUpdateTask)

module.exports = distUpdateTask

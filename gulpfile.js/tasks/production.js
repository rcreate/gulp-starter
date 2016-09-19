var config = require('../lib/getConfig')()
var option = require('../lib/option')(config)
var gulp = require('gulp')
var gulpSequence = require('gulp-sequence')
var getEnabledTasks = require('../lib/getEnabledTasks')

var productionTask = function (cb) {
    global.environment = 'production'
    var tasks = getEnabledTasks()
    var sequence = []

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
    if (config.tasks.production && config.tasks.production.rev) {
        sequence.push('rev')
    }

    // static file copy
    if (config.tasks.static) {
        sequence.push('static')
    }

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

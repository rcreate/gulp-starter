if (!GULP_CONFIG.tasks.jade && !GULP_CONFIG.tasks.pug) {
    return
}

var pug = require('./pug')
var gulp = require('gulp')
gulp.task('jade', pug)
module.exports = pug

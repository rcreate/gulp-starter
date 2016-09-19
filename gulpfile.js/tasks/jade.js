var config = require('../lib/getConfig')()
if (!config.tasks.jade && !config.tasks.pug) {
    return
}

var pug = require('./pug')
var gulp = require('gulp')
gulp.task('jade', pug)
module.exports = pug

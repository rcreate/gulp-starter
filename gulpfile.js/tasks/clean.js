var gulp   = require('gulp')
var del    = require('del')
var config = require('../lib/getConfig')()
var dest   = require('../lib/dest')

var cleanTask = function (cb) {
  del([dest()+"/**/*"], {force:true}).then(function (paths) {
    cb()
  })
}

gulp.task('clean', cleanTask)
module.exports = cleanTask

var gulp   = require('gulp')
var del    = require('del')
var config = require('../lib/getConfig')()

var cleanTask = function (cb) {
  var dest = config.root.dest;
  if (global.production) {
    dest = config.root.build;
  }

  del([dest+"/**/*"], {force:true}).then(function (paths) {
    cb()
  })
}

gulp.task('clean', cleanTask)
module.exports = cleanTask

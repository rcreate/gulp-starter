var gulp   = require('gulp')
var del    = require('del')

var cleanTask = function (cb) {
  var dest = GULP_CONFIG.root.dest;
  if (global.production) {
    dest = GULP_CONFIG.root.build;
  }
  return del([dest], { force: true })
}

gulp.task('clean', cleanTask)
module.exports = cleanTask

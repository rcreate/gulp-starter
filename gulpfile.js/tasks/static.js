var config  = require('../lib/getConfig')()
var changed = require('gulp-changed')
var gulp    = require('gulp')
var path    = require('path')

var dest = config.root.dest;
if (global.production) {
  dest = config.root.build;
}

var paths = {
  src: [
    path.join(config.root.src, config.tasks.static.src, '/**'),
    path.join('!' + config.root.src, config.tasks.static.src, '/README.md')
  ],
  dest: path.join(dest, config.tasks.static.dest)
}

var staticTask = function() {
  return gulp.src(paths.src)
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(gulp.dest(paths.dest))
}

gulp.task('static', staticTask)
module.exports = staticTask

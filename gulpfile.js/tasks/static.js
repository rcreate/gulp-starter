var config       = require('../lib/getConfig')()
if(!config.tasks.static) return

var dest    = require('../lib/dest')
var changed = require('gulp-changed')
var gulp    = require('gulp')
var path    = require('path')

var paths = {
  src: [
    path.join(config.root.src, config.tasks.static.src, '/**'),
    path.join('!' + config.root.src, config.tasks.static.src, '/README.md')
  ]
}

var staticTask = function() {
  return gulp.src(paths.src)
    .pipe(changed(dest(config.tasks.static.dest))) // Ignore unchanged files
    .pipe(gulp.dest(dest(config.tasks.static.dest)))
}

gulp.task('static', staticTask)
module.exports = staticTask

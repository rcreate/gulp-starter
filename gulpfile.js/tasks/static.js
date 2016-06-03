var dest    = require('../lib/dest')
var changed = require('gulp-changed')
var gulp    = require('gulp')
var path    = require('path')

var paths = {
  src: [
    path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.static.src, '**'),
    path.resolve(process.env.PWD, '!' + GULP_CONFIG.root.src, GULP_CONFIG.tasks.static.src, 'README.md')
  ]
}

var staticTask = function() {
  return gulp.src(paths.src)
    .pipe(changed(dest(GULP_CONFIG.tasks.static.dest))) // Ignore unchanged files
    .pipe(gulp.dest(dest(GULP_CONFIG.tasks.static.dest)))
}

gulp.task('static', staticTask)
module.exports = staticTask

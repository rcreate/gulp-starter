if(!GULP_CONFIG.tasks.fonts) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var path        = require('path')
var gulpif       = require('gulp-if')

var fontsTask = function() {

  var paths = {
    src: path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.fonts.src, '**/*.{' + GULP_CONFIG.tasks.fonts.extensions + '}'),
    dest: path.resolve(process.env.PWD, GULP_CONFIG.root.dest, GULP_CONFIG.tasks.fonts.dest),
    build: path.resolve(process.env.PWD, GULP_CONFIG.root.build, GULP_CONFIG.tasks.fonts.dest)
  }

  return gulp.src([paths.src, '*!README.md'])
    // Ignore unchanged files
    .pipe(gulpif(!global.production, changed(paths.dest)))

    .pipe(gulpif(!global.production, gulp.dest(paths.dest)))
    .pipe(gulpif(global.production, gulp.dest(paths.build)))
    .pipe(browserSync.stream())
}

gulp.task('fonts', fontsTask)
module.exports = fontsTask

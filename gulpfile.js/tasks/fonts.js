if(!GULP_CONFIG.tasks.fonts) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var path        = require('path')
var gulpif      = require('gulp-if')
var dest        = require('../lib/dest')

var fontsTask = function() {

  var paths = {
    src: path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.fonts.src, '**/*.{' + GULP_CONFIG.tasks.fonts.extensions + '}')
  }

  return gulp.src([paths.src, '*!README.md'])
    // Ignore unchanged files
    .pipe(gulpif(global.environment === 'development', changed(dest(GULP_CONFIG.tasks.fonts.dest))))
    .pipe(gulp.dest(dest(GULP_CONFIG.tasks.fonts.dest)))
    .pipe(browserSync.stream())
}

gulp.task('fonts', fontsTask)
module.exports = fontsTask

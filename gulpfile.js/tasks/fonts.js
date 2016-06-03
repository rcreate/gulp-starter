var config      = require('../lib/getConfig')()
if(!config.tasks.fonts) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var path        = require('path')
var gulpif      = require('gulp-if')
var dest        = require('../lib/dest')

var paths = {
  src: path.join(config.root.src, config.tasks.fonts.src, '/**/*.{' + config.tasks.fonts.extensions + '}')
}

var fontsTask = function() {
  return gulp.src([paths.src, '*!README.md'])
    // Ignore unchanged files
    .pipe(gulpif(global.environment === 'development', changed(dest(config.tasks.fonts.dest))))
    .pipe(gulp.dest(dest(config.tasks.fonts.dest)))
    .pipe(browserSync.stream())
}

gulp.task('fonts', fontsTask)
module.exports = fontsTask

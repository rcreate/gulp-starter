var config      = require('../lib/getConfig')()
if(!config.tasks.fonts) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var path        = require('path')
var gulpif       = require('gulp-if')

var paths = {
  src: path.join(config.root.src, config.tasks.fonts.src, '/**/*.{' + config.tasks.fonts.extensions + '}'),
  dest: path.join( config.root.dest, config.tasks.fonts.dest),
  build: path.join( config.root.build, config.tasks.fonts.dest)

}

var fontsTask = function() {

  console.log("starting fontsTask production:"+global.production);
  return gulp.src([paths.src, '*!README.md'])
    // Ignore unchanged files
    .pipe(gulpif(!global.production, changed(paths.dest)))

    .pipe(gulpif(!global.production, gulp.dest(paths.dest)))
    .pipe(gulpif(global.production, gulp.dest(paths.build)))
    .pipe(browserSync.stream())
}

gulp.task('fonts', fontsTask)
module.exports = fontsTask

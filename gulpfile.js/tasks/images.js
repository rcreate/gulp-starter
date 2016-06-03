if(!GULP_CONFIG.tasks.images) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var imagemin    = require('gulp-imagemin')
var path        = require('path')
var gulpif       = require('gulp-if')
var dest        = require('../lib/dest')

var imagesTask = function() {

  var paths = {
    src: path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.images.src, '**/*.{' + GULP_CONFIG.tasks.images.extensions + '}')
  }

  return gulp.src([paths.src, , '*!README.md'])
    // Ignore unchanged files
    .pipe(gulpif(global.environment === 'development', changed(dest(GULP_CONFIG.tasks.images.dest))))
    .pipe(gulpif(global.environment !== 'development', imagemin())) // Optimize
    .pipe(gulp.dest(dest(GULP_CONFIG.tasks.images.dest)))

  .pipe(browserSync.stream())
}

var devTask = function () {
  global.environment = 'development'
  imagesTask()
}

gulp.task('images', imagesTask)
gulp.task('images:dev', devTask)
gulp.task('images:prod', imagesTask)
gulp.task('images:dist', imagesTask)
module.exports = imagesTask

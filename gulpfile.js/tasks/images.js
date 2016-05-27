var config      = require('../lib/getConfig')()
if(!config.tasks.images) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var imagemin    = require('gulp-imagemin')
var path        = require('path')
var gulpif       = require('gulp-if')


var paths = {
  src: path.join(config.root.src, config.tasks.images.src, '/**/*.{' + config.tasks.images.extensions + '}'),
  dest: path.join(config.root.dest, config.tasks.images.dest),
  build: path.join(config.root.build, config.tasks.images.dest)
}

var imagesTask = function() {
  return gulp.src([paths.src, , '*!README.md'])
    // Ignore unchanged files
    .pipe(gulpif(!global.production, changed(paths.dest)))
  
    .pipe(imagemin()) // Optimize
    .pipe(gulpif(!global.production, gulp.dest(paths.dest)))
    .pipe(gulpif(global.production, gulp.dest(paths.build)))

  .pipe(browserSync.stream())
}

gulp.task('images', imagesTask)
module.exports = imagesTask

if(!GULP_CONFIG.tasks.images) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var imagemin    = require('gulp-imagemin')
var path        = require('path')
var gulpif       = require('gulp-if')


var imagesTask = function() {

  var paths = {
    src: path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.images.src, '**/*.{' + GULP_CONFIG.tasks.images.extensions + '}'),
    dest: path.resolve(process.env.PWD, GULP_CONFIG.root.dest, GULP_CONFIG.tasks.images.dest),
    build: path.resolve(process.env.PWD, GULP_CONFIG.root.build, GULP_CONFIG.tasks.images.dest)
  }

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

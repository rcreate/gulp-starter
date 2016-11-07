var config      = require('../lib/getConfig')()
if(!config.tasks.images) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var imagemin    = require('gulp-imagemin')
var path        = require('path')
var gulpif       = require('gulp-if')
var dest        = require('../lib/dest')
var globExt     = require('../lib/globExtension')

var paths = {
    src: path.join(config.root.src, config.tasks.images.src, '/**/*.' + globExt(config.tasks.images.extensions)),
}

var imagesTask = function() {
    return gulp.src([paths.src, '*!README.md'])
    // Ignore unchanged files
        .pipe(gulpif(global.environment === 'development', changed(dest(config.tasks.images.dest))))
        .pipe(gulpif(global.environment !== 'development', imagemin())) // Optimize
        .pipe(gulp.dest(dest(config.tasks.images.dest)))

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

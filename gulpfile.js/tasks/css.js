var config       = require('../lib/getConfig')()
if(!config.tasks.css) return

var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var browserSync  = require('browser-sync')
var sass         = require('gulp-sass')
var sourcemaps   = require('gulp-sourcemaps')
var handleErrors = require('../lib/handleErrors')
var autoprefixer = require('gulp-autoprefixer')
var path         = require('path')
var cssnano      = require('gulp-cssnano')

var exclude = path.join(config.root.src, config.tasks.css.src, '**/{' + config.tasks.css.excludeFolders.join(',') + '}/**/*.{' + config.tasks.css.extensions + '}')

var paths = {
  src: [
    path.join(config.root.src, config.tasks.css.src, '/**/*.{' + config.tasks.css.extensions + '}'),
    "!"+exclude
  ],
  dest: path.join(config.root.dest, config.tasks.css.dest),
  build: path.join(config.root.build, config.tasks.css.dest)
};



var cssTask = function () {
  return gulp.src(paths.src)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(sass(config.tasks.css.sass))
    .on('error', handleErrors)
    .pipe(autoprefixer(config.tasks.css.autoprefixer))
    .pipe(gulpif(global.production, cssnano({autoprefixer: false})))
    .pipe(gulpif(!global.production, sourcemaps.write()))
    .pipe(gulpif(!global.production, gulp.dest(paths.dest)))
    .pipe(gulpif(global.production, gulp.dest(paths.build)))
    .pipe(browserSync.stream())
}

gulp.task('css', cssTask)
module.exports = cssTask

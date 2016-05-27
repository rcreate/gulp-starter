if(!GULP_CONFIG.tasks.css) return

var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var browserSync  = require('browser-sync')
var sass         = require('gulp-sass')
var sourcemaps   = require('gulp-sourcemaps')
var handleErrors = require('../lib/handleErrors')
var autoprefixer = require('gulp-autoprefixer')
var path         = require('path')
var cssnano      = require('gulp-cssnano')

var cssTask = function () {

  var exclude = path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.css.src, '**/{' + GULP_CONFIG.tasks.css.excludeFolders.join(',') + '}/**/*.{' + GULP_CONFIG.tasks.css.extensions + '}')
  var paths = {
    src: [
        path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.css.src, '**/*.{' + GULP_CONFIG.tasks.css.extensions + '}'),
        "!"+exclude
    ],
    dest: path.resolve(process.env.PWD, GULP_CONFIG.root.dest, GULP_CONFIG.tasks.css.dest),
    build: path.resolve(process.env.PWD, GULP_CONFIG.root.build, GULP_CONFIG.tasks.css.dest)
  }

  return gulp.src(paths.src)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(sass(GULP_CONFIG.tasks.css.sass))
    .on('error', handleErrors)
    .pipe(autoprefixer(GULP_CONFIG.tasks.css.autoprefixer))
    .pipe(gulpif(global.production, cssnano({autoprefixer: false})))
    .pipe(gulpif(!global.production, sourcemaps.write()))
    .pipe(gulpif(!global.production, gulp.dest(paths.dest)))
    .pipe(gulpif(global.production, gulp.dest(paths.build)))
    .pipe(browserSync.stream())
}

gulp.task('css', cssTask)
module.exports = cssTask

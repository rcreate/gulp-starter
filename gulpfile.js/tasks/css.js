if(!GULP_CONFIG.tasks.css) return

var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var browserSync  = require('browser-sync')
var sourcemaps   = require('gulp-sourcemaps')
var handleErrors = require('../lib/handleErrors')
var dest         = require('../lib/dest')
var autoprefixer = require('gulp-autoprefixer')
var path         = require('path')
var cssnano      = require('gulp-cssnano')

var cssTask = function () {

  // decide which plugin should be used (sass or less)
  if( typeof GULP_CONFIG.tasks.css.type === "undefined" ){
      GULP_CONFIG.tasks.css['type'] = 'sass'
  }
  var pluginType = GULP_CONFIG.tasks.css.type
  var plugin = require('gulp-'+pluginType)

  var exclude = path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.css.src, '**/{' + GULP_CONFIG.tasks.css.excludeFolders.join(',') + '}/**/*.{' + GULP_CONFIG.tasks.css.extensions + '}')
  var paths = {
    src: [
        path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.css.src, '**/*.{' + GULP_CONFIG.tasks.css.extensions + '}'),
        "!"+exclude
    ]
  }

  return gulp.src(paths.src)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(plugin(GULP_CONFIG.tasks.css[pluginType]))
    .on('error', handleErrors)
    .pipe(autoprefixer(GULP_CONFIG.tasks.css.autoprefixer))
    .pipe(gulpif(global.environment !== 'development', cssnano({autoprefixer: false})))
    .pipe(gulpif(global.environment === 'development', sourcemaps.write()))
    .pipe(gulp.dest(dest(GULP_CONFIG.tasks.css.dest)))
    .pipe(browserSync.stream())
}

gulp.task('css', cssTask)
module.exports = cssTask

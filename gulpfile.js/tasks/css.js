var config       = require('../lib/getConfig')()
if(!config.tasks.css) return

var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var browserSync  = require('browser-sync')
var sourcemaps   = require('gulp-sourcemaps')
var handleErrors = require('../lib/handleErrors')
var dest         = require('../lib/dest')
var autoprefixer = require('gulp-autoprefixer')
var path         = require('path')
var cssnano      = require('gulp-cssnano')

// decide which plugin should be used (sass or less)
if( typeof config.tasks.css.type === "undefined" ){
  config.tasks.css['type'] = 'sass'
}
var pluginType = config.tasks.css.type
var plugin = require('gulp-'+pluginType)

var exclude = path.join(config.root.src, config.tasks.css.src, '**/{' + config.tasks.css.excludeFolders.join(',') + '}/**/*.{' + config.tasks.css.extensions + '}')
var paths = {
  src: [
    path.join(config.root.src, config.tasks.css.src, '/**/*.{' + config.tasks.css.extensions + '}'),
    "!"+exclude
  ]
};

var cssTask = function () {
  return gulp.src(paths.src)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(plugin(config.tasks.css[pluginType]))
    .on('error', handleErrors)
    .pipe(autoprefixer(config.tasks.css.autoprefixer))
    .pipe(gulpif(global.environment === 'development', sourcemaps.write()))
    .pipe(gulpif(global.environment !== 'development', cssnano({autoprefixer: false})))
    .pipe(gulp.dest(dest(config.tasks.css.dest)))
    .pipe(browserSync.stream())
}

gulp.task('css', cssTask)
module.exports = cssTask

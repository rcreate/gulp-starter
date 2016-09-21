var config       = require('../lib/getConfig')()
if(!config.tasks.css) return

var gulp = require('gulp')
var gulpif = require('gulp-if')
var browserSync = require('browser-sync')
var sourcemaps = require('gulp-sourcemaps')
var handleErrors = require('../lib/handleErrors')
var dest = require('../lib/dest')
var globExtension = require('../lib/globExtension')
var autoprefixer = require('gulp-autoprefixer')
var path = require('path')
var cssnano = require('gulp-cssnano')
var rename = require('gulp-rename')

// decide which plugin should be used (sass or less)
if( typeof config.tasks.css.type === "undefined" ){
  config.tasks.css['type'] = 'sass'
}
var pluginType = config.tasks.css.type
var plugin = require('gulp-'+pluginType)
var extensions = globExtension(config.tasks.css.extensions)

var exclude = path.join(config.root.src, config.tasks.css.src, '**/{' + config.tasks.css.excludeFolders.join(',') + '}/**/*.' + extensions)
var paths = {
  src: [
    path.join(config.root.src, config.tasks.css.src, '/**/*.' + extensions),
    "!"+exclude
  ]
};

var cssTask = function () {
  var deployUncompressed = (global.environment === 'distribution' && config.tasks.css.deployUncompressed)

  return gulp.src(paths.src)
      .pipe(gulpif(!global.production, sourcemaps.init()))
      .pipe(plugin(config.tasks.css[pluginType]))
      .on('error', handleErrors)
      .pipe(autoprefixer(config.tasks.css.autoprefixer))
      .pipe(gulpif(deployUncompressed, gulp.dest(dest(config.tasks.css.dest))))
      .pipe(gulpif(global.environment === 'development', sourcemaps.write()))
      .pipe(gulpif(global.environment !== 'development', cssnano({autoprefixer: false})))
      .pipe(rename({extname: '.min.css'}))
      .pipe(gulp.dest(dest(config.tasks.css.dest)))
      .pipe(browserSync.stream())
}

gulp.task('css', cssTask)
module.exports = cssTask

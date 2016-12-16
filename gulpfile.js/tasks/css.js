if(!GULP_CONFIG.tasks.css) return

var gulp = require('gulp')
var gulpif = require('gulp-if')
var browserSync = require('browser-sync')
var sourcemaps = require('gulp-sourcemaps')
var handleErrors = require('../lib/handleErrors')
var dest = require('../lib/dest')
var globExtension = require('../lib/globExtension')
var importer = require('npm-sass-require')
var autoprefixer = require('gulp-autoprefixer')
var path = require('path')
var cssnano = require('gulp-cssnano')
var rename = require('gulp-rename')
var extend = require('extend')

var cssTask = function () {

  // decide which plugin should be used (sass or less)
  if( typeof GULP_CONFIG.tasks.css.type === "undefined" ){
      GULP_CONFIG.tasks.css['type'] = 'sass'
  }
  var pluginType = GULP_CONFIG.tasks.css.type
  var plugin = require('gulp-'+pluginType)
  var extensions = globExtension(GULP_CONFIG.tasks.css.extensions)
  var options = extend(GULP_CONFIG.tasks.css[pluginType], {importer: importer})

  var deployUncompressed = (global.environment === 'distribution' && GULP_CONFIG.tasks.css.deployUncompressed)

  var exclude = '';
  if( GULP_CONFIG.tasks.css.excludeFolders ) {
      exclude = "!" + path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.css.src, '**/{' + GULP_CONFIG.tasks.css.excludeFolders.join(',') + '}/**/*.' + extensions)
  }

  var paths = {
    src: [
        path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.css.src, '**/*.' + extensions),
        exclude
    ]
  }

  return gulp.src(paths.src)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(plugin(options))
    .on('error', handleErrors)
    .pipe(autoprefixer(GULP_CONFIG.tasks.css.autoprefixer))
    .pipe(gulpif(deployUncompressed, gulp.dest(dest(GULP_CONFIG.tasks.css.dest))))
    .pipe(gulpif(global.environment !== 'development', cssnano({autoprefixer: false})))
    .pipe(gulpif(global.environment === 'development', sourcemaps.write()))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(dest(GULP_CONFIG.tasks.css.dest)))
    .pipe(browserSync.stream())
}

gulp.task('css', cssTask)
module.exports = cssTask

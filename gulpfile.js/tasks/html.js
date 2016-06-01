var config       = require('../lib/getConfig')()
if(!config.tasks.html) return

var browserSync  = require('browser-sync')
var data         = require('gulp-data')
var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var handleErrors = require('../lib/handleErrors')
var htmlmin      = require('gulp-htmlmin')
var path         = require('path')
var render       = require('gulp-nunjucks-render')
var fs           = require('fs')

var exclude = path.join(config.root.src, config.tasks.html.src, '**/{' + config.tasks.html.excludeFolders.join(',') + '}/**/*.{' + config.tasks.html.extensions + '}')

var paths = {
  src: [
    path.join(config.root.src, config.tasks.html.src, '/**/*.{' + config.tasks.html.extensions + '}'),
    "!"+exclude
  ],
  dest: path.join(config.root.dest, config.tasks.html.dest),
  build: path.join(config.root.build, config.tasks.html.dest),
}

var getData = function(file) {
  var env = ( global.production === true ? 'production' : 'development');
  var dataFile = config.tasks.html.dataFile.replace('{environment}', env)
  var dataPath = path.resolve(config.root.src, config.tasks.html.src, dataFile)
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
}

var getEnv = function(file) {
  return { environment: ( global.production === true ? 'production' : 'development') }
}

var htmlTask = function() {

  return gulp.src(paths.src)
    .pipe(data(getData))
    .pipe(data(getEnv))
    .on('error', handleErrors)
    .pipe(render({
      path: [path.join(config.root.src, config.tasks.html.src)],
      envOptions: {
        watch: false
      }
    }))
    .on('error', handleErrors)
    .pipe(gulpif(global.production, htmlmin(config.tasks.html.htmlmin)))
    .pipe(gulpif(!global.production, gulp.dest(paths.dest)))
    .pipe(gulpif(global.production, gulp.dest(paths.build)))
    .pipe(browserSync.stream())

}

gulp.task('html', htmlTask)
module.exports = htmlTask

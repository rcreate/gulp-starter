if(!GULP_CONFIG.tasks.html) return

var browserSync  = require('browser-sync')
var data         = require('gulp-data')
var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var handleErrors = require('../lib/handleErrors')
var dest         = require('../lib/dest')
var htmlmin      = require('gulp-htmlmin')
var path         = require('path')
var render       = require('gulp-nunjucks-render')
var fs           = require('fs')

var htmlTask = function() {

  var exclude = path.normalize('!**/{' + GULP_CONFIG.tasks.html.excludeFolders.join(',') + '}/**')

  var paths = {
    src: [path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.html.src, '**/*.{' + GULP_CONFIG.tasks.html.extensions + '}'), exclude]
  }

  var getData = function(file) {
    var dataFile = GULP_CONFIG.tasks.html.dataFile.replace('{environment}', global.environment)
    var dataPath = path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.html.src, dataFile)
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  }

  return gulp.src(paths.src)
    .pipe(data(getData))
    .on('error', handleErrors)
    .pipe(render({
      path: [path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.html.src)],
      envOptions: {
        watch: false
      }
    }))
    .on('error', handleErrors)
    .pipe(gulpif(global.environment !== 'development' && GULP_CONFIG.tasks.html.min == true, htmlmin(GULP_CONFIG.tasks.html.htmlmin)))
    .pipe(gulp.dest(dest(GULP_CONFIG.tasks.html.dest)))
    .on('end', browserSync.reload)

}

gulp.task('html', htmlTask)
module.exports = htmlTask

var config       = require('../lib/getConfig')()
if(!config.tasks.jade) return

var browserSync  = require('browser-sync')
var data         = require('gulp-data')
var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var handleErrors = require('../lib/handleErrors')
var dest         = require('../lib/dest')
var htmlmin      = require('gulp-htmlmin')
var path         = require('path')
var jade         = require('jade')
var render       = require('gulp-jade')
var fs           = require('fs')

var jadeOptions = {
    jade: jade,
    pretty: true
};

var exclude = path.join(config.root.src, config.tasks.jade.src, '**/{' + config.tasks.jade.excludeFolders.join(',') + '}/**/*.{' + config.tasks.jade.extensions + '}')

var paths = {
  src: [
    path.join(config.root.src, config.tasks.jade.src, '/**/*.{' + config.tasks.jade.extensions + '}'),
    "!"+exclude
  ]
}

var getData = function(file) {
  var dataFile = config.tasks.jade.dataFile.replace('{environment}', global.environment)
  var dataPath = path.resolve(config.root.src, config.tasks.jade.src, dataFile)
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
}

var jadeTask = function() {

  return gulp.src(paths.src)
    .pipe(data(getData))
    .on('error', handleErrors)
    .pipe(render(jadeOptions))
    .on('error', handleErrors)
    .pipe(gulpif((global.environment !== 'development' && config.tasks.jade.min == true), htmlmin(config.tasks.jade.htmlmin)))
    .pipe(gulp.dest(dest(config.tasks.jade.dest)))
    .pipe(browserSync.stream({once: true}))

}

gulp.task('jade', jadeTask)
module.exports = jadeTask

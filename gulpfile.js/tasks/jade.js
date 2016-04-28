var config       = require('../lib/getConfig')()
if(!config.tasks.jade) return

var browserSync  = require('browser-sync')
var data         = require('gulp-data')
var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var handleErrors = require('../lib/handleErrors')
var htmlmin      = require('gulp-htmlmin')
var path         = require('path')
var jade         = require('jade')
var render       = require('gulp-jade')
var fs           = require('fs')

var jadeOptions = {
    jade: jade,
    pretty: true
};

var exclude = path.normalize('!**/{' + config.tasks.jade.excludeFolders.join(',') + '}/**')

var paths = {
  src: [path.join(config.root.src, config.tasks.jade.src, '/**/*.jade'), exclude],
  dest: path.join(config.root.dest, config.tasks.jade.dest),
}

var getData = function(file) {
  var dataPath = path.resolve(config.root.src, config.tasks.jade.src, config.tasks.jade.dataFile)
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
}

var jadeTask = function() {

  return gulp.src(paths.src)
    .pipe(data(getData))
    .on('error', handleErrors)
    .pipe(render(jadeOptions))
    .on('error', handleErrors)
    .pipe(gulpif(process.env.NODE_ENV == 'production', htmlmin(config.tasks.jade.htmlmin)))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())

}

gulp.task('jade', jadeTask)
module.exports = jadeTask

var config       = require('../lib/getConfig')()
if(!config.tasks.styleguide) return

var path = require('path')
var gulp = require('gulp')
var watch = require('gulp-watch')
var sass = require('gulp-sass');
var styleguide = require('sc5-styleguide');
var gulpSequence = require('gulp-sequence')

var paths = {
  src: path.join(config.root.src, config.tasks.styleguide.src, '/**/*.{' + config.tasks.styleguide.extensions + '}'),
  entry: path.resolve(config.root.src, config.tasks.styleguide.entry),
  dest: path.join(config.root.dest, config.tasks.styleguide.dest)
}

var sgGenerateTask = function () {
  return gulp.src(paths.src)
    .pipe(styleguide.generate({
      title: config.tasks.styleguide.title,
      server: true,
      port: 4000,
      rootPath: paths.dest,
      enableJade: (config.tasks.jade?true:false),
      overviewPath: path.resolve(config.root.src, config.tasks.styleguide.overview)
    }))
    .pipe(gulp.dest(paths.dest));
}

var sgApplyStylesTask = function () {
  return gulp.src(paths.entry)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(paths.dest));
}

var sgWatchTask = function() {
    var glob = path.join(config.root.src, config.tasks.styleguide.src, '**/*.{' + config.tasks.styleguide.extensions.join(',') + '}')
    gulp.watch(glob, ['styleguide:generate', 'styleguide:applystyles']);
}

var styleguideLaunchTask = function(cb) {
    require("opn")('http://localhost:4000', {app: null});
}

var styleguideTask = function(cb) {
    gulpSequence(['styleguide:generate', 'styleguide:applystyles'], 'styleguide:watch', 'styleguide:launch', cb);
}

gulp.task('styleguide:generate', sgGenerateTask)
gulp.task('styleguide:applystyles', sgApplyStylesTask)
gulp.task('styleguide:launch', styleguideLaunchTask)
gulp.task('styleguide', styleguideTask)

gulp.task('styleguide:watch', sgWatchTask)

module.exports = styleguideTask

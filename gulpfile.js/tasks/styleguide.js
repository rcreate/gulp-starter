var config       = require('../lib/getConfig')()
if(!config.tasks.styleguide) return

var path = require('path'),
    gulp = require('gulp'),
    del = require('del'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    styleguide = require('sc5-styleguide'),
    gulpSequence = require('gulp-sequence'),
    rename = require('gulp-rename');

var paths = {
  src: path.join(config.root.src, config.tasks.styleguide.src, '/**/*.{' + config.tasks.styleguide.extensions + '}'),
  entry: path.join(config.root.src, config.tasks.styleguide.src, config.tasks.styleguide.entry),
  dest: path.join(config.root.dest, config.tasks.styleguide.dest)
}

var sgCleanTask = function () {
    del(paths.dest, {force: true});
}

var sgGenerateTask = function () {
  return gulp.src(paths.src)
    .pipe(styleguide.generate({
      title: config.tasks.styleguide.title,
      server: true,
      port: 4000,
      rootPath: paths.dest,
      enableJade: (config.tasks.jade?true:false),
      overviewPath: path.join(config.root.src, config.tasks.styleguide.overview),
      styleVariables: path.join(config.root.src, config.tasks.styleguide.src, 'config/_config.sass'),
      parsers: {
          sass: 'sass'
      },
    }))
    .pipe(gulp.dest(paths.dest));
}

var sgApplyStylesTask = function () {
  return gulp.src(paths.entry)
    .pipe(sass({errLogToConsole: true}))
    .pipe(rename('styleguide.css'))
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
    gulpSequence('styleguide:generate', 'styleguide:applystyles', 'styleguide:watch', 'styleguide:launch', cb);
}

gulp.task('styleguide:clean', sgCleanTask)
gulp.task('styleguide:generate', sgGenerateTask)
gulp.task('styleguide:applystyles', sgApplyStylesTask)
gulp.task('styleguide:launch', styleguideLaunchTask)
gulp.task('styleguide', styleguideTask)

gulp.task('styleguide:watch', sgWatchTask)

module.exports = styleguideTask

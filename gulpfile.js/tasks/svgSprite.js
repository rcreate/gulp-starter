if(!GULP_CONFIG.tasks.svgSprite) return

var browserSync = require('browser-sync')
var gulp        = require('gulp')
var imagemin    = require('gulp-imagemin')
var svgstore    = require('gulp-svgstore')
var path        = require('path')
var dest        = require('../lib/dest')

var svgSpriteTask = function() {

  var settings = {
    src: path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.svgSprite.src, '*.svg')
  }

  return gulp.src(settings.src)
    .pipe(imagemin())
    .pipe(svgstore())
    .pipe(gulp.dest(dest(GULP_CONFIG.tasks.svgSprite.dest)))
    .pipe(browserSync.stream())
}

gulp.task('svgSprite', svgSpriteTask)
module.exports = svgSpriteTask

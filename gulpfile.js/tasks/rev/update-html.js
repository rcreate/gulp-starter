var gulp       = require('gulp')
var dest       = require('../../lib/dest')
var revReplace = require('gulp-rev-replace')
var path       = require('path')

// 5) Update asset references in HTML
gulp.task('update-html', function(){
  var manifest = gulp.src(dest("rev-manifest.json"))
  return gulp.src(dest(GULP_CONFIG.tasks.production.rev.src, '**/*.html'))
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(dest(GULP_CONFIG.tasks.production.rev.dest)))
})

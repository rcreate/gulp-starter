var gulp         = require('gulp')
var gulpSequence = require('gulp-sequence')

var tagMinorTask = function(cb) {
  gulpSequence('bump:minor', 'git:add', 'git:commit','git:tag', cb)
}
var tagMajorTask = function(cb) {
  gulpSequence('bump:major', 'git:add', 'git:commit','git:tag', cb)
}

gulp.task('tag', tagMinorTask)
gulp.task('tag:minor', tagMinorTask)
gulp.task('tag:major', tagMajorTask)

module.exports = tagMinorTask

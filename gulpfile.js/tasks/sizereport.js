var gulp         = require('gulp')
var repeatString = require('../lib/repeatString')
var sizereport   = require('gulp-sizereport')

gulp.task('size-report', function() {
    var dest = GULP_CONFIG.root.dest;
    if (global.production) {
        dest = GULP_CONFIG.root.build;
    }

    return gulp.src([dest + '**/*', '*!rev-manifest.json'])
    .pipe(sizereport({
      gzip: true
    }))
})

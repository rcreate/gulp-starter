var config       = require('../lib/getConfig')()
var gulp         = require('gulp')
var repeatString = require('../lib/repeatString')
var sizereport   = require('gulp-sizereport')

gulp.task('size-report', function() {
    var dest = config.root.dest;
    if (global.production) {
        dest = config.root.build;
    }

    return gulp.src([dest + '/**/*', '*!rev-manifest.json'])
    .pipe(sizereport({
      gzip: true
    }))
})

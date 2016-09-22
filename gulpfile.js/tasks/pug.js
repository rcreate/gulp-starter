var config = require('../lib/getConfig')()
if (!config.tasks.jade && !config.tasks.pug) {
    return
}

var browserSync = require('browser-sync')
var data = require('gulp-data')
var gulp = require('gulp')
var gulpif = require('gulp-if')
var handleErrors = require('../lib/handleErrors')
var dest = require('../lib/dest')
var globExt = require('../lib/globExtension')
var htmlmin = require('gulp-htmlmin')
var path = require('path')
var pug = require('pug')
var fs = require('fs')
var extend = require('extend')

var pugOptions = {
    pug: pug,
    pretty: true
};

var pugConfig = config.tasks.pug
var gulpPug = require('gulp-pug')

if (!pugConfig) {
    pugConfig = config.tasks.jade
    gulpPug = require('gulp-jade')
}

var exclude = path.join(config.root.src, pugConfig.src, '**/{' + pugConfig.excludeFolders.join(',') + '}/**/*.' + globExt(pugConfig.extensions))

var paths = {
    src: [
        path.join(config.root.src, pugConfig.src, '/**/*.' + globExt(pugConfig.extensions)),
        "!" + exclude
    ]
}

var getData = function (file) {
    var i,
        data = {},
        dataFile,
        dataPath,
        dataFiles = [ pugConfig.dataFile ]

    if( pugConfig.data ) {
        dataFiles = pugConfig.data;
    }

    for( i in dataFiles ) {
        dataFile = dataFiles[i].replace('{environment}', global.environment);
        dataPath = path.resolve(config.root.src, pugConfig.src, dataFile);
        data = extend(data, JSON.parse(fs.readFileSync(dataPath, 'utf8')));
    }

    return data;
}

var pugTask = function () {
    return gulp.src(paths.src)
        .pipe(data(getData))
        .on('error', handleErrors)
        .pipe(gulpPug(pugOptions))
        .on('error', handleErrors)
        .pipe(gulpif((global.environment !== 'development' && pugConfig.htmlmin), htmlmin(pugConfig.htmlmin)))
        .pipe(gulp.dest(dest(pugConfig.dest)))
        .on('end', function() {
            browserSync.reload()
        })
}

gulp.task('pug', pugTask)
module.exports = pugTask

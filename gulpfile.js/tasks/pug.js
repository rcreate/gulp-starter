if (!GULP_CONFIG.tasks.jade && !GULP_CONFIG.tasks.pug) {
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

var pugTask = function () {
    var pugConfig = GULP_CONFIG.tasks.pug
    var gulpPug = require('gulp-pug')

    if (!pugConfig) {
        pugConfig = GULP_CONFIG.tasks.jade
        gulpPug = require('gulp-jade')
    }

    var exclude = '!'+path.resolve(process.env.PWD, GULP_CONFIG.root.src, pugConfig.src, '**/{' + pugConfig.excludeFolders.join(',') + '}/**')
    var paths = {
        src: [ path.resolve(process.env.PWD, GULP_CONFIG.root.src, pugConfig.src, '**/*.' + globExt(pugConfig.extensions)), exclude ]
    }

    var getData = function (file) {
        var i,
            data = {},
            dataFile,
            dataPath,
            dataFiles = [ pugConfig.dataFile ],
            packageJsonPath = './../../package.json';

        if( !fs.existsSync(packageJsonPath) ) {
            packageJsonPath = './package.json';
        }

        if( pugConfig.data ) {
            dataFiles = pugConfig.data;
        }

        for( i in dataFiles ) {
            dataFile = dataFiles[i].replace('{environment}', global.environment);
            dataPath = path.resolve(process.env.PWD, GULP_CONFIG.root.src, pugConfig.src, dataFile);
            data = extend(data, JSON.parse(fs.readFileSync(dataPath, 'utf8')));
        }

        data["packageJson"] = JSON.parse(
            fs.readFileSync(path.resolve(packageJsonPath), 'utf8')
        );

        return data;
    }

    return gulp.src(paths.src)
        .pipe(data(getData))
        .on('error', handleErrors)
        .pipe(gulpPug(pugOptions))
        .on('error', handleErrors)
        .pipe(gulpif((global.environment !== 'development' && pugConfig.htmlmin == true), htmlmin(pugConfig.htmlmin)))
        .pipe(gulp.dest(dest(pugConfig.dest)))
        .on('end', browserSync.reload)
}

gulp.task('pug', pugTask)
module.exports = pugTask

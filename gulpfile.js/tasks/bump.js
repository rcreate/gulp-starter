'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');
var fs = require('fs');
var semver = require('gulp-bump/node_modules/semver');

var pkg = JSON.parse(fs.readFileSync('../../package.json', 'utf8'));

var bumbTask = function (type) {
    var newVer = semver.inc(pkg.version, type);
    console.log("bumping package.json and composer json to version:"+newVer);
    return gulp.src(['../../package.json', '../../composer.json'])
        .pipe(bump({
            version: newVer,
            type: type
        }))
        .pipe(gulp.dest('../../'));
}

// bump patch, minor or major versions on package/composer.json
gulp.task('bump:patch', function(){
    return bumbTask('patch')
});
gulp.task('bump:minor', function(){
    return bumbTask('minor')
});
gulp.task('bump:major', function(){
    return bumbTask('major')
});

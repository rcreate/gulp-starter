'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');
var fs = require('fs');
var semver = require('gulp-bump/node_modules/semver');

var pkg = JSON.parse(fs.readFileSync('../../package.json', 'utf8'));

// bump versions on package/composer
gulp.task('bump', function () {
    var newVer = semver.inc(pkg.version, 'minor');
    console.log("bumpig package.json and composer json to version:"+newVer);
    return gulp.src(['../../package.json', '../../composer.json'])
    .pipe(bump({
        version: newVer,
        type: "minor"
    }))
    .pipe(gulp.dest('../../'));
});

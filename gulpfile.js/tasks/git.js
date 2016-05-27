'use strict';
var gulp = require('gulp');
var git = require('gulp-git');
var fs = require('fs');

gulp.task('git:add', function () {
    return gulp.src(['../../package.json', '../../composer.json', '../../build'])
    .pipe(git.add());
});

gulp.task('git:commit', function () {

    var version = JSON.parse(fs.readFileSync('../../package.json', 'utf8')).version;

    return gulp.src(['..\/..\/package.json', '..\/..\/composer.json', '..\/..\/build'])
    .pipe(git.commit('updating build to:' + version))
});

gulp.task('git:tag', function(){

    var version = JSON.parse(fs.readFileSync('../../package.json', 'utf8')).version;
    git.tag(version, 'updating build to:' + version, function (err) {
        if (err) throw err;
    });
});
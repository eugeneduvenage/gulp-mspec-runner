"use strict";
var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  jasmine = require('gulp-jasmine');


gulp.task('lint', function() {
  return gulp.src(['**/*.js', '!node_modules/**/*'])
    .pipe(jshint({
      node: true
    }))
    .pipe(jshint.reporter('default'));
});

gulp.task('test', gulp.series('lint', function runTests() {
  return gulp.src('./spec/test.js')
    .pipe(jasmine());
}));

gulp.task('watch', function() {
  return gulp.watch(['**/*.js', '!node_modules/**/*.js'], ['test']);
});

gulp.task('default', gulp.series('test'));

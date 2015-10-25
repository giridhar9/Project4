'use strict';
var gulp = require('gulp'); 
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var historyApiFallback = require('connect-history-api-fallback');
gulp.task('scss', function () {
  gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            middleware: [ historyApiFallback() ]
        }
    });
    gulp.watch('./scss/**/*.scss', ['scss']);
    gulp.watch(["index.html", "js/*.js", "css/*.css"]).on('change', browserSync.reload);
});
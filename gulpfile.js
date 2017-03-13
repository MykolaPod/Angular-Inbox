
var gulp = require('gulp');
var useref = require('gulp-useref');
var server = require('gulp-server-livereload');
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('start', function() {
    gulp.src('app')
        .pipe(server({
            livereload: false,
            open: true,
            host:'0.0.0.0'
        }));
});

gulp.task('build',['clean','build-Views','build-components'], function () {
    return gulp.src(['app/*.html'])
        .pipe(useref())
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
    return del.sync('build');
});


gulp.task('build-Views', function () {
    return gulp.src(['app/Views/**/*.html'])
        .pipe(gulp.dest('build/Views/'));
});
gulp.task('build-components', function () {
    return gulp.src(['app/components/**/*.html'])
        .pipe(gulp.dest('build/components/'));
});

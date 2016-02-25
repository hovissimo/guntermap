'use strict';

var babel = require('babelify');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var debug = require('gulp-debug');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

// See https://github.com/spalger/gulp-jshint
var packageJSON = require('./package');
var jshintConfig = packageJSON.jshintConfig;
jshintConfig.lookup = false;

function compile(watch) {
   // Use watchify instead of gulp.watch for building the JS because watchify can build incrementally for huge performance gains
   var entryfile = 'js/app.js';
   var bundler = watchify(browserify(entryfile, { debug: true }).transform(babel));

   function rebundle() {
      bundler.bundle()
         .on('error', gutil.log.bind(gutil, 'Browserify Error'))
         .pipe(source(entryfile))
         .pipe(buffer())
         .pipe(sourcemaps.init({ loadMaps: true, debug: true }))
         // ---> transformations go here
         .pipe(sourcemaps.write())
         .pipe(gulp.dest('./dist'));
   }

   if (watch) {
      bundler.on('update', rebundle);
   }

   rebundle();
}
gulp.task('collect_module_images', function() {
   // If one of our modules has .../dist/images, we will assume we need those (This is really just for leaflet)
   return gulp.src([
         './node_modules/**/dist/images/*.png',
         './node_modules/**/dist/images/*.jpg',
         './node_modules/**/dist/images/*.gif',
      ])
      .pipe(rename({dirname: ''}))
      .pipe(debug())
      .pipe(gulp.dest('./dist/images'));
});

gulp.task('jshint', function() {
   return gulp.src('js/**/*.js')
      //.pipe(debug())
      .pipe(jshint(jshintConfig))
      .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
   return gulp.src('scss/**/*.scss')
      //.pipe(debug())
      .pipe(sass())
      .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function() {
   gulp.watch('js/**/*.js', ['jshint']);
   gulp.watch('scss/**/*.scss', ['sass']);
   return compile(true);
});

gulp.task('default', ['watch']);

gulp.task('build', function() { return compile(); });

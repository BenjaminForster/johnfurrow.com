'use strict';
let babel = require('gulp-babel');
let browserSync = require('browser-sync');
let cleanCSS = require('gulp-clean-css');
let gulp = require('gulp');
let pug = require('gulp-pug');
let sass = require('gulp-sass');
let uglify = require('gulp-uglify');
let webpack = require('webpack-stream');

let textCyclerItems = require('./src/scripts/constants/textCyclerItems');

let paths = {
  dist: './dist',
  src: './src',
  scripts: '/scripts/**/*.js',
  scriptsEntry: '/scripts/index.js',
  styles: '/styles/**/*.scss',
  stylesEntry: '/styles/index.scss',
  views: '/views/**/*.pug',
  viewsEntry: '/views/index.pug'
};

gulp.task('scripts', function () {
  return gulp.src(`${paths.src}${paths.scriptsEntry}`)
    .pipe(webpack({
      output: {filename: 'index.js'},
      module: {
        loaders: [{
          exclude: /node_modules/,
          test: /\.js$/,
          loader: 'babel',
          query: {presets: ['es2015'], plugins: ['transform-runtime']}
        }]
      },
    }))
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['styles'], function() {
  browserSync.init({
    open: false,
    server: paths.dist
  });
});

gulp.task('styles', function () {
  return gulp.src(`${paths.src}${paths.stylesEntry}`)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(cleanCSS({keepSpecialComments: 0}))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
});

gulp.task('views', function () {
  return gulp.src(`${paths.src}${paths.views}`)
    .pipe(pug({locals: {initialItem: textCyclerItems[0]}}))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  gulp.watch(`${paths.src}${paths.scripts}`, ['scripts']);
  gulp.watch(`${paths.src}${paths.styles}`, ['styles']);
  gulp.watch(`${paths.src}${paths.views}`, ['views']);
});

gulp.task('default', ['watch', 'scripts', 'styles', 'views', 'serve']);
gulp.task('dist', ['scripts', 'styles', 'views']);

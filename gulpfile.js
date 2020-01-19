// Import modules
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    mozjpeg = require('imagemin-mozjpeg'),
    svgo = require('imagemin-svgo'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync');

// Create data variable
var src = {
  html: 'src/index.html',
  sass: 'src/sass/**/*.+(scss|sass)',
  js: 'src/js/**/*.js',
  libsCss: '',
  libsJs: '',
  images: 'src/images/**/*',
  fonts: 'src/fonts/**/*',
  favicon: 'src/favicon/**/*'
};

// Init tasks
gulp.task('html', function () {
  return gulp.src(src.html)
          .pipe(gulp.dest('public/'))
          .pipe(browserSync.reload( {stream: true} ));
});

gulp.task('sass', function () {
  return gulp.src(src.sass)
          .pipe(sass({ outputStyle: 'compressed' }))
          .pipe(autoprefixer())
          .pipe(rename({ suffix: '.min' }))
          .pipe(gulp.dest('public/css/'))
          .pipe(browserSync.reload( {stream: true} ));
});

gulp.task('js', function () {
  return gulp.src(src.js)
          .pipe(gulp.dest('public/js/'))
          .pipe(browserSync.reload( {stream: true} ));
});

gulp.task('libs-css', function () {
  return gulp.src(src.libsCss)
    .pipe(concat('libs.css'))
    .pipe(uglifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/css/'))
    .pipe(browserSync.reload( {stream: true} ));
});

gulp.task('libs-js', function () {
  return gulp.src(src.libsJs)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/js/'))
    .pipe(browserSync.reload( {stream: true} ));
});

gulp.task('images', function () {
  return gulp.src(src.images)
          .pipe(cache(imagemin([
              mozjpeg(),
              pngquant(),
              svgo()
            ], { verbose: true })))
          .pipe(gulp.dest('public/images/'));
});

gulp.task('fonts', function () {
  return gulp.src(src.fonts)
          .pipe(gulp.dest('public/fonts/'))
});

gulp.task('favicon', function () {
  return gulp.src(src.favicon)
          .pipe(gulp.dest('public/favicon/'))
});

gulp.task('watch', function () {
  gulp.watch(src.html, gulp.parallel('html'));
  gulp.watch(src.sass, gulp.parallel('sass'));
  gulp.watch(src.js, gulp.parallel('js'));
  gulp.watch(src.libsCss, gulp.parallel('libs-css'));
  gulp.watch(src.libsJs, gulp.parallel('libs-js'));
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './public/'
    }
  });
});

gulp.task('clear', function() {
   return cache.clearAll();
});

// Run tasks
gulp.task('server', gulp.parallel('watch', 'browser-sync'));

gulp.task('default', gulp.series('html', 'sass', 'js', 'images', 'fonts', 'server'));
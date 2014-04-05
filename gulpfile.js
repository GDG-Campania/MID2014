var gulp = require('gulp'),
    concat = require('gulp-concat'),
    refresh = require('gulp-livereload'),

    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),

    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),

    imagemin = require('gulp-imagemin'),

    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),

    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload')
    livereloadport = 35729,
    serverport = 5000;

// We only configure the server here and start it only when running the watch task
var server = express();
// Add livereload middleware before static-middleware
server.use(livereload({
    port: livereloadport
}));

server.use(express.static('./dist'));

gulp.task('styles', function() {
    return gulp.src('assets/css/**/*')
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(refresh(lrserver));
});

gulp.task('compass', ['styles'], function() {
    return gulp.src('assets/sass/*.sass')
        .pipe(compass({
            // project: path.join(__dirname, 'assets'),
            css: 'dist/assets/css',
            sass: 'assets/sass'
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'compass task complete' }));
});

gulp.task('vendorScripts', function() {
    return gulp.src([
        'assets/js/vendor/*.js'
    ])
        .pipe(gulp.dest('dist/assets/js/vendor'))
        .pipe(refresh(lrserver));
});


gulp.task('scripts', ['vendorScripts'], function() {
    return gulp.src([
        'assets/js/plugins.js',
        'assets/js/main.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'Scripts task complete' }));
});


gulp.task('html', function(){
    gulp.src('index.html')
        .pipe(gulp.dest('dist'))
        .pipe(refresh(lrserver));
});


gulp.task('images', function() {
    return gulp.src('assets/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('build', function() {
    gulp.run('html', 'scripts', 'images', 'compass');
});

gulp.task('clean', function() {
    return gulp.src([
        'dist/assets/css',
        'dist/assets/js',
        'dist/assets/img'
    ], {read: false})
        .pipe(clean());
});


gulp.task('serve', function() {
    server.listen(serverport);

    lrserver.listen(livereloadport);
});

gulp.task('watch', function() {
    gulp.watch('assets/sass/*.sass', function() {
        gulp.run('compass');
    });

    gulp.watch('index.html', function () {
        gulp.run('html');
    });

    gulp.watch('assets/img/**/*', function () {
        gulp.run('images');
    });

    gulp.watch('assets/js/**/*.js', function () {
        gulp.run('scripts');
    });
});

gulp.task('default', function () {
    gulp.run('build', 'serve', 'watch');
});

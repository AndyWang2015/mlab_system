'use strict';
// var config = require('./config.json');
var gulp= require('gulp');
var $ = require('gulp-load-plugins')();
var imageminPngquant = require('imagemin-pngquant');
var imageminMozjpeg = require('imagemin-mozjpeg');

//Event
gulp.task('compass',function(){
    gulp.src('scss/*.scss')
    	.pipe($.plumber()) // if error will not stop gulp
		.pipe($.compass({
			sourcemap: true,
			time: true,
			css: 'andy/css',
			sass: 'scss',
			style: 'compressed'
		}))    
		.pipe(gulp.dest('andy/css'))
		.pipe($.connect.reload());
});
gulp.task('js',function(){
    gulp.src('js/*.js')
    	.pipe($.plumber())
    	.pipe($.uglify())
	    .pipe(gulp.dest('andy/js'))
		.pipe($.connect.reload());
});
gulp.task('connect', function() {
  $.connect.server({
  	root: 'D:/yihsien/js-mongoDB_mLab/andy/',
  	livereload: true
  });
});
gulp.task('imageminJPG', function () {
	gulp.src('org_images/*.jpg')
		.pipe($.plumber())
		.pipe($.changed('andy/images'))	
		.pipe(imageminMozjpeg({quality: 90})())
		.pipe(gulp.dest('andy/images'));
});
gulp.task('imageminPNG', function () {
	gulp.src('org_images/*.png')
		.pipe($.plumber())
		.pipe($.changed('andy/images'))	
		.pipe(imageminPngquant({quality: '90'})())
		.pipe(gulp.dest('andy/images'));
});
gulp.task('uploadHTML', function () {
	gulp.src('html/*.html')
		.pipe($.changed('andy'))
		.pipe(gulp.dest('andy'))
		.pipe($.connect.reload());
});
gulp.task('del',function(){
	require('del')('node_modules');
});

//AddListener
gulp.task('default',['connect'], function() {
	gulp.watch(['scss/*.scss'],['compass']);
	gulp.watch(['js/*.js'],['js']);
	gulp.watch(['org_images/*.jpg'],['imageminJPG']);
	gulp.watch(['org_images/*.png'],['imageminPNG']);
	gulp.watch(['html/*.html'],['uploadHTML']);
});

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var exec = require('child_process').exec;

gulp.task('mocha', function() {
	return gulp.src(['qa/**/*.js', 'public/qa/**/*.js'], { read: false })
		.pipe(mocha({ ui : 'tdd', timeout: 15000 }))
		.pipe(mocha({ reporter: 'nyan' }));
});

gulp.task('lint', function() {
	return gulp.src(['meadowlark.js', 'public/js/**/*.js', 'lib/**/*.js',
			'gulpfile.js', 'public/qa/**/*.js', 'qa/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('exec', function() {
	exec('blc http://localhost:3000/ -ro', function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
	})
});

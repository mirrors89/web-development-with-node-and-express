var path = require('path');
var gulp = require('gulp');

require('require-all')(path.resolve(__dirname, 'task'));

gulp.task('default', ['mocha', 'lint', 'exec']);

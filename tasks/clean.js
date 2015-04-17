let gulp = require('gulp');
let del = require('del');

gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

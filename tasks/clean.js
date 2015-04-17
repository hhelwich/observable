let gulp = require('gulp');
let del = require('del');

gulp.task('clean', (cb) => {
  del(['dist'], cb);
});

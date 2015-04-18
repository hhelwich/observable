import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('build', (cb) => {
  runSequence('clean', ['lint', 'bundle'], 'minify', 'specs', cb);
});

import gulp from 'gulp';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';

gulp.task('update-src', (cb) => {
  runSequence(['lint-src', 'bundle-src'], () => {
    browserSync.reload();
    cb();
  });
});

gulp.task('update-spec', (cb) => {
  runSequence(['lint-spec', 'bundle-spec'], () => {
    browserSync.reload();
    cb();
  });
});

gulp.task('update-runner', (cb) => {
  runSequence(['copy-runner'], () => {
    browserSync.reload();
    cb();
  });
});

gulp.task('test', (cb) => {
  runSequence(['lint', 'bundle'], () => {
    browserSync.reload();
    cb();
  });
});

gulp.task('watch', () => {
  runSequence('clean', 'bower', 'test', () => {
    browserSync({ server: './build' });
    gulp.watch(['src/**/*.js'], ['update-src']);
    gulp.watch(['src/.jscsrc', 'src/.jshintrc'], { dot: true }, ['lint-src']);
    gulp.watch(['spec/**/*.js'], ['update-spec']);
    gulp.watch(['spec/index.html'], ['update-runner']);
    gulp.watch(['spec/.jscsrc', 'spec/.jshintrc'], { dot: true }, ['lint-spec']);
    gulp.watch(['tasks/.jscsrc', 'tasks/.jshintrc'], { dot: true }, ['lint-tasks']);
    gulp.watch(['tasks/**/*'], ['test']);
  });
});

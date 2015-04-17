import gulp from 'gulp';
import jshint from 'gulp-jshint';

gulp.task('lintTasks', () => {
  return gulp.src('./tasks/**/*.js').pipe(jshint()).pipe(jshint.reporter('default'));
});

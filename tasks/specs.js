import gulp from 'gulp';
import jasmine from 'gulp-jasmine-phantom';

gulp.task('specs', () => {
  return gulp.src(['dist/observable.min.js', 'build/observable-spec.js'])
    .pipe(jasmine());
});

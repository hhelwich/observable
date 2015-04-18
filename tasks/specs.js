import gulp from 'gulp';
import jasmine from 'gulp-jasmine-phantom';

gulp.task('specs', () => {
  return gulp.src(['dist/bundle.min.js', 'build/bundle-spec.js'])
    .pipe(jasmine());
});

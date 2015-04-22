import gulp from 'gulp';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

gulp.task('minify', () => {
  return gulp.src('build/observable.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('dist/'));
});

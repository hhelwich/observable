import gulp from 'gulp';
import jscs from 'gulp-jscs';
import jshint from 'gulp-jshint';
import stylish from 'gulp-jscs-stylish';

let noop = () => {};

gulp.task('lintTasks', () => {
  gulp.src('tasks/**/*.js')
    .pipe(jshint())
    .pipe(jscs({ configPath: 'tasks/.jscsrc' }))
    .on('error', noop)
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
});

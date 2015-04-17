import gulp from 'gulp';
import jscs from 'gulp-jscs';
import jshint from 'gulp-jshint';
import stylish from 'gulp-jscs-stylish';

let noop = () => {};

let createLintTask = (dir) => {
  gulp.task(`lint-${dir}`, () => {
    gulp.src(`${dir}/**/*.js`)
      .pipe(jshint())
      .pipe(jscs({ configPath: `${dir}/.jscsrc` }))
      .on('error', noop)
      .pipe(stylish.combineWithHintResults())
      .pipe(jshint.reporter('jshint-stylish'));
  });
};

['tasks', 'src', 'spec'].forEach(createLintTask);

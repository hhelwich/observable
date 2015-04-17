import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';

let createTranspile = (dir) => {
  gulp.task(`transpile-${dir}`, () => {
    return gulp.src(`${dir}/**/*.js`)
      .pipe(sourcemaps.init())
      .pipe(concat(`${dir}.js`))
      .pipe(babel())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist'));
  });
};

['src', 'spec'].forEach(createTranspile);

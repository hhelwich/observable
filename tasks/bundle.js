import gulp from 'gulp';
import fs from 'fs';
import browserify from 'browserify';
import babelify from 'babelify';
import babel from 'gulp-babel';
import mkdirp from 'mkdirp';

gulp.task('copy-runner', () => {
  return gulp.src('spec/runner.html').pipe(gulp.dest('build'));
});

let createBundleTask = (dir) => {
  gulp.task(`bundle-${dir}`, () => {
    mkdirp('./build', (err) => {
      if (err) {
        console.log('Error: ', err.message);
      } else {

        browserify({ debug: true })
          .transform(babelify)
          .require(`./${dir}/main.js`, { entry: true })
          .bundle()
          .on('error', (err) => {
            console.log('Error : ' + err.message);
          }).pipe(fs.createWriteStream(`build/bundle-${dir}.js`));
      }
    });
  });
};

['src', 'spec'].forEach(createBundleTask);

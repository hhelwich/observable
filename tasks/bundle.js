import gulp from 'gulp';
import fs from 'fs';
import browserify from 'browserify';
import babelify from 'babelify';
import babel from 'gulp-babel';
import mkdirp from 'mkdirp';
import browserSync from 'browser-sync';

gulp.task('copy-runner', () => {
  return gulp.src('spec/index.html').pipe(gulp.dest('build'));
});

gulp.task('copy-jasmine', () => {
  return gulp.src('bower_components/jasmine/lib/jasmine-core/**/*').pipe(gulp.dest('build/jasmine'));
});

let createBundleTask = (dir) => {
  gulp.task(`bundle-${dir}`, (cb) => {
    mkdirp('./build', (err) => {
      if (err) {
        console.log('Error: ', err.message);
        cb();
      } else {
        browserify({ debug: true })
          .transform(babelify)
          .require(`./${dir}/main.js`, { entry: true })
          .bundle()
          .on('error', (err) => {
            console.log('Error : ' + err.message);
            cb();
          }).pipe(fs.createWriteStream(`build/bundle${dir === 'spec' ? '-spec' : ''}.js`).on('close', cb));
      }
    });
  });
};

['src', 'spec'].forEach(createBundleTask);

gulp.task('bundle', ['copy-runner', 'copy-jasmine', 'bundle-src', 'bundle-spec']);

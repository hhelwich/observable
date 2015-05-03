import gulp from 'gulp';
import fs from 'fs';
import browserify from 'browserify';
import babelify from 'babelify';
import mkdirp from 'mkdirp';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import wrap from 'gulp-wrap';

gulp.task('copy-runner', () => {
  return gulp.src('spec/runner/**/*').pipe(gulp.dest('build'));
});

gulp.task('copy-jasmine', () => {
  return gulp.src('bower_components/jasmine/lib/jasmine-core/**/*').pipe(gulp.dest('build/lib/jasmine'));
});

gulp.task('copy-ramda', () => {
  return gulp.src('bower_components/ramda/dist/ramda.js').pipe(gulp.dest('build/lib'));
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
          }).pipe(fs.createWriteStream(`build/observable${dir === 'spec' ? '-spec' : ''}.js`).on('close', cb));
      }
    });
  });
};

['spec'].forEach(createBundleTask);

const privateExports = [
  'toArray', 'copyArray', 'appendArray', 'compose', 'curry', 'curryObs', 'isFunc', 'isObservable'
].map(s => `${s}:${s}`).join(',');

gulp.task('bundle-src', () => {
  return gulp.src([
    'util', 'main'
  ].map(name => `src/${name}.js`))
    .pipe(sourcemaps.init())
    .pipe(babel({ blacklist: ['spec.functionName']}))
    .pipe(concat('observable.js'))
    .pipe(wrap('/*jshint ignore:start*/ /*jscs:disable*/ (function(global){<%= contents %>' +
      'if (typeof RELEASE === \'undefined\' || !RELEASE) {' +
      `global._private={${privateExports}};}global.O=Observable;}(this));`))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build'));
});

gulp.task('bundle', ['copy-runner', 'copy-jasmine', 'copy-ramda', 'bundle-src', 'bundle-spec']);

import gulp from 'gulp';
import del from 'del';

let createCleanTask = (dir) => {
  gulp.task(`clean-${dir}`, (cb) => {
    del([dir], cb);
  });
};

['build', 'dist'].forEach(createCleanTask);

gulp.task('clean', ['clean-build', 'clean-dist']);

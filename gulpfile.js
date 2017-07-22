const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

gulp.task('es6', () => {
  return gulp.src('./lib/**/*.js')
          .pipe(sourcemaps.init())
          .pipe(babel({
              presets: ['es2015']
          }))
          // .pipe(concat('all.js'))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('dist'));
});
 
gulp.task('watch', () => {
    gulp.watch('./lib/**/*.js', ['es6']);
});
 
gulp.task('default', ['es6', 'watch']);
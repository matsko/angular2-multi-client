var gulp = require('gulp');

gulp.task('copy-web-files',[], function(){
  gulp.src(['./src/**/*.css','./src/**/*.html'], { base: './src' })
  .pipe(gulp.dest('dist/web'));
});

gulp.task('copy-desktop-files',[], function(){
  gulp.src(['./src/**/*.css','./src/**/*.html'], { base: './src' })
  .pipe(gulp.dest('dist/desktop'));
});

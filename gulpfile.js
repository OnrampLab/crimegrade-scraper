const spawnSync = require('child_process').spawnSync;
const gulp = require('gulp');

function runApify(cb) {
  const { stdout, stderr } = spawnSync('yarn', ['apify'], {
    stdio: 'inherit',
  });

  if (stderr) {
    console.error(`error: ${stderr}`);
  }

  cb();
}

gulp.task('watch', function () {
  // Endless stream mode
  return gulp.watch('build/**/*.js', gulp.series(runApify));
});

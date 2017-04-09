import gulp from "gulp";
import browserify from "browserify";
import source from "vinyl-source-stream";
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

//script paths
var jsFiles = 'dist/bundle.js',
    jsDest = 'dist/';

gulp.task("default", () => {
  return browserify("src/js/app.js")
    .transform("babelify")
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task('dist', function() {
  return gulp.src(jsFiles)
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest(jsDest))
      .pipe(rename('bundle.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(jsDest));
});

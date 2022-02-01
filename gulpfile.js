var gulp = require("gulp"),
  // HTML Packages
  pug = require("gulp-pug"),
  htmlmin = require("gulp-htmlmin"),
  cache = require("gulp-cache"),
  //
  concat = require("gulp-concat"),
  jshint = require("gulp-jshint"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  //
  autoprefixer = require("gulp-autoprefixer"),
  sass = require("gulp-sass")(require("sass")), // Images Packages
  imagemin = require("gulp-imagemin"),
  //
  babel = require("gulp-babel"),
  plumber = require("gulp-plumber"),
  //

  livereload = require("gulp-livereload");

// HTML
gulp.task("html", () => {
  return gulp
    .src("src/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist/"))
    .pipe(livereload());
});

// Styles
gulp.task("styles", function () {
  return gulp
    .src("src/scss/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer(
        "last 2 version",
        "safari 5",
        "ie 8",
        "ie 9",
        "opera 12.1",
        "ios 6",
        "android 4"
      )
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(livereload());
});

// Scripts
gulp.task("scripts", function () {
  return (
    gulp
      .src("src/js/*.js")
      .pipe(sourcemaps.init())
      // Stop the process if an error is thrown.
      .pipe(plumber())
      // Transpile the JS code using Babel's preset-env.
      .pipe(
        babel({
          presets: [
            [
              "@babel/env",
              {
                modules: false,
              },
            ],
          ],
        })
      )
      .pipe(jshint.reporter("default"))
      .pipe(concat("main.js"))
      .pipe(rename({ suffix: ".min" }))
      .pipe(uglify())
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist/js"))
      .pipe(livereload())
  );
});

// Images
gulp.task("images", function () {
  return gulp
    .src("src/images/**/*")
    .pipe(
      cache(
        imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
      )
    )
    .pipe(gulp.dest("dist/images"))
    .pipe(livereload());
});

// Watch files
gulp.task("watch", () => {
  require("./server");
  livereload.listen();
  gulp.watch(["src/*.pug", "src/**/*.pug"], gulp.series("html"));
  gulp.watch(["src/scss/*.scss", "src/scss/**/*.scss"], gulp.series("styles"));
  gulp.watch("src/js/*.js", gulp.series("scripts"));
  gulp.watch("src/images/**/*", gulp.series("images"));
});

gulp.task("default", gulp.series("watch"));

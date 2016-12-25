"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var sourcemaps = require('gulp-sourcemaps');
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var del = require("del");

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(sourcemaps.init()) // карты
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
        autoprefixer({
          browsers: [
            "last 2 versions"
          ]
        })
      ]),
      mqpacker({
        sort: true
      }))
    .pipe(sourcemaps.write()) // карты
    .pipe(rename("style.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("stylemin", function() {
  gulp.src("sass/style.scss")
    .pipe(sourcemaps.init()) // карты
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
        autoprefixer({
          browsers: [
            "last 2 versions"
          ]
        })
      ]),
      mqpacker({
        sort: true
      }))
    .pipe(sourcemaps.write()) // карты
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      })
    ]))
    .pipe(gulp.dest("img"));
});

gulp.task("symbols", function() {
  return gulp.src("img/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("img"));
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: "./build",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("copy", function() {
  return gulp.src([
      "fonts*/**/*.{woff,woff2}",
      "img/**",
      "js/**",
      "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", function(fn) {
  run("clean", "copy",
    "style", "stylemin", "images", "symbols", fn);
});

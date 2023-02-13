// Gulp API
const { src, dest, watch, series, parallel }    = require('gulp');

// Gulp packages
var gulp                = require('gulp');
var sass                = require('gulp-sass')(require('sass'));
var rename              = require('gulp-rename');
var purge               = require('gulp-purgecss');
// Browser Sync
var browserSync         = require("browser-sync").create();

// Files
const files = {
  sass_src_path:    './scss/**/*.scss',
  css_dest_public:  './',
};

async function sassDevTask() {
    return src(files.sass_src_path)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(dest(files.css_dest_public))
        .pipe(browserSync.stream())
};

//  On check la sortie 
async function watchDevTask() {
    browserSync.init({
      server: "./"
  });
  watch([files.sass_src_path],
    {
      intervall: 750, usePolling: true},
      series(
          parallel(sassDevTask),
      )
  );
  watch('/*.html').on('change',browserSync.reload);
};


exports.default = series( parallel(sassDevTask), watchDevTask,);

// 

async function purgeCss() {
  return gulp.src('./*css')
      .pipe(purge({
          content: ['./**/*.html']
      }))
      .pipe(dest(files.css_dest_public))
}

async function renameCss() {
gulp.src("./style.css")
  .pipe(rename("style.min.css"))
  .pipe(dest(files.css_dest_public))
}

exports.purge = series( parallel(purgeCss, renameCss,));
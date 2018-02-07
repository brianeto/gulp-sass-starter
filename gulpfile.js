const
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  babel = require('gulp-babel')
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  browserSync = require('browser-sync').create();

// sass tasks
gulp.task('sass', () =>
  gulp.src('src/scss/main.scss')
    .pipe(postcss([autoprefixer()]))
    .pipe(sass({
      sourceComments: false,
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream())
);   

// javascript tasks
gulp.task('js', () =>
  gulp.src('src/js/main.js')
  .pipe(babel({ presets: ['env'] }))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js/'))
);

// sass lint ftw(for better coding practices)
gulp.task('sass_lint', lintCssTask = () => {
  const gulpStylelint = require('gulp-stylelint');
  return gulp
    .src('src/scss/**/*.scss')
    .pipe(gulpStylelint({
      reporters: [
        { formatter: 'string', console: true }
      ]
    }));
});

// images optimization works with jpeg, jpg, svg, gif, png
gulp.task('images', () =>
  gulp.src('src/images/*')
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('dist/images/'))
);
// Just copy/paste html to distribution folder
gulp.task('html', () =>
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist/'))
);

// Static Server + watching html/scss/js files
gulp.task('default', ['sass', 'js', 'images', 'html'], () => {
  browserSync.init({
      server: {
        baseDir: 'dist/'
      }
  });
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/main.js', ['js']);
  gulp.watch('src/index.html').on('change', browserSync.reload);
});

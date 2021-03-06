const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const path = require('path')
const argv = require('yargs').argv
const browserSync = require('browser-sync').create()

plugins.multipipe = require('multipipe')
plugins.pngquant = require('imagemin-pngquant')

const CONFIG = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'static'),
  isProd: typeof argv.env !== 'undefined' && argv.env === 'prod',
}

gulp.task('css', () =>
  require('./gulp-tasks/css')(gulp, plugins, {
    src: [CONFIG.src + '/css/**/*.scss'],
    dest: CONFIG.dest + '/css',
    isProd: CONFIG.isProd,
  }),
)

gulp.task('js', () =>
  require('./gulp-tasks/js')(gulp, plugins, {
    src: [CONFIG.src + '/js/**/*.js'],
    dest: CONFIG.dest + '/js',
    isProd: CONFIG.isProd,
    watch: argv.watch,
  }),
)

gulp.task('html', () =>
  require('./gulp-tasks/html')(gulp, plugins, {
    src: [
      CONFIG.src + '/html/pages/**/*.twig',
      '!' + CONFIG.src + '/html/pages/**/_*.twig', // exclude partials
    ],
    dest: CONFIG.dest + '/',
    images: CONFIG.dest,
    templateFolder: CONFIG.src + '/html',
    isProd: CONFIG.isProd,
  }),
)

gulp.task('clean', () =>
  require('./gulp-tasks/clean')(gulp, plugins, {
    src: [CONFIG.dest + '/*', '!' + CONFIG.dest + '/assets'],
  }),
)

gulp.task('watch', function() {
  if (argv.watch) {
    gulp.watch(CONFIG.src + '/css/**/*.scss', gulp.series('css'))
    gulp.watch(CONFIG.src + '/html/**/*.twig', gulp.series('html'))
  }
})

gulp.task('serve', function() {
  browserSync.init({
    server: 'static',
  })

  browserSync.watch(CONFIG.src + '/**/*.*').on('change', browserSync.reload)
})

gulp.task('dev', gulp.series('clean', 'css', 'html', gulp.parallel('js', 'watch', 'serve')))

gulp.task('default', gulp.series('clean', 'css', 'html', 'js'))

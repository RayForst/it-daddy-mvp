const webpackStream = require('webpack-stream'),
  webpack = require('webpack')
const path = require('path')

module.exports = function(gulp, plugins, options) {
  let webpackPlugins = [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-chunk',
      minChunks: 2,
    }),
    new webpack.ProvidePlugin({
      Typed: 'typed.js',
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ]

  if (options.isProd) {
    webpackPlugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        compress: {
          warnings: false,
        },
      }),
    )
  }

  return plugins
    .multipipe(
      gulp.src(options.src, {}),
      plugins.webpack(
        {
          entry: {
            // Index
            index: __dirname + '/../src/js/index/index',
            contacts: __dirname + '/../src/js/contacts/contacts',
          },
          output: {
            publicPath: options.dest,
            filename: '[name].js',
          },
          watch: options.watch,
          devtool: !options.isProd ? 'cheap-module-inline-source-map' : '',
          resolve: {
            alias: {
              TweenLite: path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
              TweenMax: path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
              TimelineLite: path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
              TimelineMax: path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
              ScrollMagic: path.resolve(
                'node_modules',
                'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
              ),
              'animation.gsap': path.resolve(
                'node_modules',
                'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
              ),
              'debug.addIndicators': path.resolve(
                'node_modules',
                'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js',
              ),
              ScrollToPlugin: 'gsap/src/uncompressed/plugins/ScrollToPlugin',
            },
          },
          module: {
            loaders: [
              {
                test: /\.js$/,
                exclude: [/js\/vendor/, /(node_modules|bower_components)/],
                loaders: ['babel-loader?presets[]=es2015'],
              },
            ],
          },
          plugins: webpackPlugins,
          watchOptions: {
            aggregateTimeout: 200,
            poll: true,
          },
        },
        webpack,
      ),
      gulp.dest(options.dest),
    )
    .on(
      'error',
      plugins.notify.onError(function(err) {
        return {
          title: 'CSS',
          message: err.message,
        }
      }),
    )
}

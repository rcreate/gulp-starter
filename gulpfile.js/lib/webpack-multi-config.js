if(!GULP_CONFIG.tasks.js) return

var path = require('path')
var pathToUrl = require('./pathToUrl')
var webpack = require('webpack')
var webpackManifest = require('./webpackManifest')
var dest = require('./dest')
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = function(env) {
  var jsSrc = path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.js.src)
  var jsDest = dest(GULP_CONFIG.tasks.js.dest)
  var publicPath = pathToUrl(GULP_CONFIG.tasks.js.dest, '/')

  var extensions = GULP_CONFIG.tasks.js.extensions.map(function(extension) {
    return '.' + extension
  })

  var rev = GULP_CONFIG.tasks.production.rev && env === 'production'
  var filenamePattern = rev ? '[name]-[hash].min.js' : '[name].min.js'

  // should js replaced hot through webpack-hot-middleware
  var hotModuleReplacement = (
      (
        typeof GULP_CONFIG.tasks.js.hotModuleReplacement === "undefined"
        ||
        GULP_CONFIG.tasks.js.hotModuleReplacement === true
      )
      &&
      env === 'development'
  )

  var loaders = [];

  for (var key in GULP_CONFIG.loaders) {
    var loaderConfigPath = path.resolve(process.env.PWD, GULP_CONFIG.root.loaders, GULP_CONFIG.loaders[key])
    var loaderConfig = require(loaderConfigPath)();

    loaders.push(loaderConfig);
  }

  var webpackConfig = {
    context: jsSrc,
    plugins: [],
    resolve: {
      root: path.resolve(process.env.PWD, GULP_CONFIG.root.src, '../'),
      extensions: [''].concat(extensions)
    },
    module: {
      loaders: loaders
    }
  }

  if( env === 'development' ) {
    webpackConfig.devtool = 'inline-source-map'
  }

  if( hotModuleReplacement === true ) {
    // Create new entries object with webpack-hot-middleware added
    for (var key in GULP_CONFIG.tasks.js.entries) {
      var entry = GULP_CONFIG.tasks.js.entries[key]
      GULP_CONFIG.tasks.js.entries[key] = ['webpack-hot-middleware/client?&reload=true'].concat(entry)
    }

    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if(env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry = GULP_CONFIG.tasks.js.entries

    webpackConfig.output= {
      path: path.normalize(jsDest),
      filename: filenamePattern,
      publicPath: publicPath
    }

    if(GULP_CONFIG.tasks.js.extractSharedJs) {
      // Factor out common dependencies into a shared.js
      webpackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'shared',
          filename: filenamePattern,
        })
      )
    }
  }

  if(rev && env !== "development") {
    webpackConfig.plugins.push(new webpackManifest(publicPath, dest()))
  }

  if( hotModuleReplacement === false ) {
    webpackConfig.output = {
      path: path.normalize(jsDest),
      filename: filenamePattern,
      publicPath: publicPath
    }

    webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify(env)
          }
        })
    )

    // optimize source in production version
    if (env !== "development") {
      webpackConfig.plugins.push(
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin(),
          new webpack.NoErrorsPlugin()
      )
    }

    // additionally build raw version of files
    if (
        env === "distribution"
        &&
        GULP_CONFIG.tasks.js.deployUncompressed
        &&
        GULP_CONFIG.tasks.js.deployUncompressed === true
    ) {
      webpackConfig.plugins.push(new UnminifiedWebpackPlugin())
    }
  }

  if( env === 'production' ) {
    webpackConfig.devtool = '#source-map'
  }

  return webpackConfig
}

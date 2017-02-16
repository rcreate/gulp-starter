'use strict';

if (!TASK_CONFIG.javascripts) {
  return
}

let path = require('path')
let pathToUrl = require('./pathToUrl')
let webpack = require('webpack')
let webpackManifest = require('./webpackManifest')
let dest            = require('./dest')
let UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
let _object = require('lodash/object');

module.exports = function(env) {
  let jsSrc = path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.javascripts.src)
  let jsDest = dest(PATH_CONFIG.javascripts.dest)
  let publicPath = pathToUrl(TASK_CONFIG.javascripts.publicPath || PATH_CONFIG.javascripts.dest, '/')

  let extensions = TASK_CONFIG.javascripts.extensions.map(function (extension) {
    return '.' + extension
  })

  let rev = (TASK_CONFIG.production && TASK_CONFIG.production.rev && env === 'production')
  let filenamePattern = rev ? '[name]-[hash].min.js' : '[name].min.js'

  // should js replaced hot through webpack-hot-middleware
  let hotModuleReplacement = (
      (
        typeof TASK_CONFIG.javascripts.hotModuleReplacement === "undefined"
        ||
        TASK_CONFIG.javascripts.hotModuleReplacement === true
      )
      &&
      typeof TASK_CONFIG.browserSync !== "undefined"
      &&
      env === 'development'
  )

  // TODO: To work in < node 6, prepend process.env.PWD + node_modules/babel-preset- to each
  // Attach default babel loader config to webpack
  let babelLoader = {
    test: new RegExp(`(\\${TASK_CONFIG.javascripts.extensions.join('$|\\.')}$)`),
    loader: 'babel-loader',
    exclude: /node_modules/,
    query: TASK_CONFIG.javascripts.babel || {
      presets: ['es2015', 'stage-1']
    }
  };

  // if custom babel loader config is present extend the given configuration
  if (TASK_CONFIG.javascripts.babelLoader !== undefined) {
    babelLoader = _object.assign(babelLoader, TASK_CONFIG.javascripts.babelLoader);
  }

  let webpackConfig = {
    context: jsSrc,
    output: {},
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin()
    ],
    resolve: {
      root: jsSrc,
      extensions: [''].concat(extensions),
      alias: TASK_CONFIG.javascripts.alias,
      fallback: path.resolve(process.env.PWD, 'node_modules')
    }, // See https://github.com/facebook/react/issues/4566
    resolveLoader: {
      fallback: path.resolve(process.env.PWD, 'node_modules')
    },
    module: {
      loaders: [babelLoader]
    }
  }

  /**
   * @deprecated since version 4.1.0, define additional loaders for development, test and production in task-config.js
   */
  webpackConfig.module.loaders = webpackConfig.module.loaders.concat(TASK_CONFIG.javascripts.loaders || [])

  // Provide global objects to imported modules to resolve dependencies (e.g. jquery)
  if (TASK_CONFIG.javascripts.provide) {
    webpackConfig.plugins.push(new webpack.ProvidePlugin(TASK_CONFIG.javascripts.provide))
  }

  if (env === 'development') {
    webpackConfig.devtool = TASK_CONFIG.javascripts.devtool || 'eval-cheap-module-source-map'
    webpackConfig.output.pathinfo = true
  }
  if( hotModuleReplacement === true ) {
    // Create new entries object with webpack-hot-middleware added
    for (let key in TASK_CONFIG.javascripts.entries) {
      let entry = TASK_CONFIG.javascripts.entries[key]
      // TODO: To work in < node 6, prepend process.env.PWD + node_modules/
      TASK_CONFIG.javascripts.entries[key] = ['webpack-hot-middleware/client?&reload=true'].concat(entry)
    }

    /**Additional loaders for dev
     * @deprecated since version 4.1.0, define additional plugins for development, test and production in task-config.js
     */
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    //Additional loaders for dev
    /**
     * @deprecated since version 4.1.0, define additional loaders in javascripts.development.loaders
     */
    webpackConfig.module.loaders = webpackConfig.module.loaders.concat(TASK_CONFIG.javascripts.developmentLoaders || [])
  }

  if (env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry = TASK_CONFIG.javascripts.entries

    if(TASK_CONFIG.javascripts.extractSharedJs) {
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
    let destination = (env === 'distribution' ? PATH_CONFIG.dist : PATH_CONFIG.dest)
    webpackConfig.plugins.push(new webpackManifest(PATH_CONFIG.javascripts.dest, destination))
  }

  webpackConfig.output.path = path.normalize(jsDest);
  webpackConfig.output.filename = filenamePattern;
  webpackConfig.output.publicPath = publicPath;

  if( hotModuleReplacement === false ) {
    webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify(env)
          }
        })
    );

    // optimize source in production version
    if (env !== "development") {
      webpackConfig.plugins.push(
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin(),
          new webpack.NoErrorsPlugin()
      );

      // Additional loaders for production
      /**
       * @deprecated since version 4.1.0, define additional loaders in javascripts.production.loaders
       */
      webpackConfig.module.loaders = webpackConfig.module.loaders.concat(TASK_CONFIG.javascripts.productionLoaders || [])
    }

    // additionally build raw version of files
    if (
        env === "distribution"
        &&
        TASK_CONFIG.javascripts.deployUncompressed
        &&
        TASK_CONFIG.javascripts.deployUncompressed === true
    ) {
      webpackConfig.plugins.push(new UnminifiedWebpackPlugin())
    }
  }

  // Additional plugins and loaders according to environment
  if (TASK_CONFIG.javascripts[env]) {
    webpackConfig.plugins = webpackConfig.plugins.concat(TASK_CONFIG.javascripts[env].plugins(webpack) || [])
    webpackConfig.module.loaders = webpackConfig.module.loaders.concat(TASK_CONFIG.javascripts[env].loaders || [])
  }

  return webpackConfig
};
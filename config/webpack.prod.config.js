const webpackMerge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

const help = require('./helper');
const webpackCommon = require('./webpack.common.config');


module.exports = function () {
  return webpackMerge(webpackCommon(), {

    output: {
      publicPath: '/',
      filename: 'js/[name].[chunkhash].js'
    },

    module: {
      rules: [{
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          emitErrors: true,
          failOnHint: true,
          configFile: help.root('tslint.json'),
          tsConfigFile: help.root('tsconfig.json')
        }
      }]
    },

    bail: true,

    plugins: [
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          }
        }
      }),
      new ExtractTextPlugin({
        filename: 'css/[name]-[chunkhash].css',
      }),
      /*      new webpack.LoaderOptionsPlugin( {
			  minimize: true,
			  debug: false
			} ),*/
      // Minify JS
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true,
          screw_ie8: true,
          unsafe: true
        },
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        comments: false
      }),
      // Copy public from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([{
        from: help.root('src/assets'),
        to: help.root('build/assets')
      }, {
        from: help.root('src/.htaccess'),
        to: help.root('build')
      }]),
      // new ImageminPlugin({
      //   test: /\.(jpe?g|gif|svg)$/i,
      //   pngquant: {
      //     quality: '69-70'
      //   },
      //   jpegtran: null,
      //   plugins: [
      //     imageminMozjpeg({
      //       quality: 69,
      //       progressive: false
      //     })
      //   ]
      // })
    ],

    devtool: 'nosources-source-map'

  })
};

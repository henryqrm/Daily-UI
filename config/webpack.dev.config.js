const webpackMerge = require('webpack-merge');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const help = require('./helper');
const webpackCommon = require('./webpack.common.config');

module.exports = function () {
  return webpackMerge(webpackCommon(), {

    devServer: {
      port: 8000,
      //stats: 'minimal',
      contentBase: help.root('build'),
      compress: false,

      quiet: false,
      noInfo: false,
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    },


    output: {
      filename: 'js/[name].js'
    },

    plugins: [
      new ExtractTextPlugin({
        filename: 'css/[name].css'
      }),
      new CopyWebpackPlugin([{
        from: help.root('src/assets'),
        to: help.root('build/assets')
      }]),
    ],

    devtool: 'inline-source-map'

  })
};

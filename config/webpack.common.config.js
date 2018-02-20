const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const chalk = require('chalk');

const help = require('./helper');

const ENV = process.env.NODE_ENV;
const ENV_msg = ENV === 'prod' ? 'PRODUCTION' : (ENV === 'dev' ? 'DEVELOPMENT' : 'TEST');

console.log(`${chalk.underline('Running in Environment:')} ${chalk.bold.green(ENV_msg)}`);

process.noDeprecation = true;
module.exports = function () {
  return {
    context: help.root('src'),

    entry: {
      index: ['./index.ts'],
      about: ['./pages/about/about.ts'],
      // vendor: ['']
    },

    output: {
      path: help.root('build'),
      publicPath: '/'
    },

    resolve: {
      extensions: ['.ts', '.js', '.json', '.css', '.less', '.html', '.hbs', '.scss'],
    },

    module: {
      noParse: /\/node_modules\/(jquery)/,
      rules: [{
          test: /\.(css|scss)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
                loader: 'css-loader',
                options: {
                  minimize: true || { /* CSSNano Options */ }
                }
              },
              {
                loader: 'postcss-loader'
              },
              {
                /* for ~slick-carousel/slick/slick-theme.scss */
                loader: 'resolve-url-loader'
              },
              {
                /* for resolve-url-loader:
                   source maps must be enabled on any preceding loader */
                loader: 'sass-loader?sourceMap'
              }
            ]
          })
        },
        {
          test: /\.(eot|otf|woff|woff2|ttf|svg|png|jpg|gif)$/,
          loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
        },
        {
          test: /\.ts$/,
          loaders: ['awesome-typescript-loader'],
          include: help.root('src')
        },
        {
          test: /\.ts$/,
          enforce: 'pre',
          loader: 'tslint-loader',
          options: {
            configFile: 'tslint.json',
            tsConfigFile: 'tsconfig.json'
          }
        },
        {
          test: /\.css$/,
          use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        chunks: ['common', 'manifest', 'index'],
        template: help.root('src/index.html'),
        cache: false,
        minify: {
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          removeAttributeQuotes: true,
          caseSensitive: true,
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          sortAttributes: true,
          sortClassName: true,
          trimCustomFragments: true
        }
      }),
      // new HtmlWebpackPlugin({
      //   filename: 'about.html',
      //   chunks: ['vendor', 'common', 'manifest', 'about'],
      //   template: help.root('src/pages/about/about.html')
      // }),
      new webpack.NamedModulesPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: ['common', 'manifest']
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(ENV)
        }
      }),
      new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /pl|en-gb/),
      new FaviconsWebpackPlugin({
        logo: help.root('src/assets/meta/favicon.png'),
        prefix: 'icons-[hash]/',
        emitStats: false,
        statsFilename: 'iconstats-[hash].json',
        persistentCache: true,
        inject: true,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: false
        }
      }),
      new HardSourceWebpackPlugin({
        cacheDirectory: help.root('node_modules') + '/.cache/hard-source/[confighash]',
        recordsPath: help.root('node_modules') + '/.cache/hard-source/[confighash]/records.json',
        configHash: require('node-object-hash')({
          sort: false
        }).hash,
      })
    ],
    devtool: 'source-map'
  };

};

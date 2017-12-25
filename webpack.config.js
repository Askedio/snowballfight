const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

const PRODUCTION = 'production';



/**
 * Plugins used in any env.
 */
const basePlugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'assets/js/vendor.js'
  }),
  new CopyWebpackPlugin([{
    from: './src/public'
  }]),
  new HtmlWebpackPlugin({
    template: './src/index.ejs',
    hash: true,
    cache: false,
    excludeChunks: ['css'],
    minify: {
      caseSensitive: true,
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      removeRedundantAttributes: true
    }
  }),
  new StyleExtHtmlWebpackPlugin({
    minify: {
      keepSpecialComments: 0
    }
  })

];


/**
 * Plugins used only in production.
 */
const prodPlugins = [
];



/**
 * Plugins used only in development.
 */
const devPlugins = [
  //
];



/**
 * Loaders used in any env.
 */
const baseLoaders = [{
  test: /\.js$/,
  loader: 'babel-loader',
  include: /src/
}, {
  test: /.json$/,
  loader: 'json-loader',
}, {
  test: /\.html$/,
  loaders: ['raw-loader', 'html-minify-loader']
}, {
  test: /.css$/,
  loader: StyleExtHtmlWebpackPlugin.inline()
}, {
  test: /\.less$/,
  loader: StyleExtHtmlWebpackPlugin.inline('less-loader')
}, {
  test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'url-loader?mimetype=application/font-woff&name=assets/fonts/[name].[ext]'
}, {
  test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'url-loader?mimetype=application/font-woff&name=assets/fonts/[name].[ext]'
}, {
  test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'url-loader?mimetype=application/octet-stream&name=assets/fonts/[name].[ext]'
}, {
  test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'url-loader?mimetype=application/vnd.ms-fontobject&name=assets/fonts/[name].[ext]'
}];



/**
 * Loaders used in only in production.
 */
const prodLoaders = [];



/**
 * Loaders used only in development.
 */
const devLoaders = []



/**
 * Webpack Configuration
 */
module.exports = {
  entry: {
    vendor: ['./src/app/vendor.js'],
    app: ['./src/app/app.js'],
    css: './src/css/app.less'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/[name].js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.css', '.less', '.json', '.html'],
    alias: {
      config: path.join(__dirname, '.env.' + process.env.NODE_ENV)
    }
  },
  module: {
    exprContextCritical: false,
    loaders: baseLoaders.concat(process.env.NODE_ENV === PRODUCTION ? prodLoaders : devLoaders)
  },
  plugins: basePlugins.concat(process.env.NODE_ENV === PRODUCTION ? prodPlugins : devPlugins)
};
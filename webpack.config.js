const { resolve, join }         = require('path');
const HtmlWebpackPlugin         = require('html-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const OptimizeCSSAssetsPlugin   = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const UglifyJsPlugin            = require('uglifyjs-webpack-plugin');

const publicPath = process.env.NODE_ENV === 'gh-pages' ? '/bcrypt-toolkit/' : '/';
const isDevMode = () => process.env.NODE_ENV === 'development';
const version = require('./package').version;

process.env.NODE_ENV = isDevMode() ? 'development' : 'production';

module.exports = {
  entry: './app/main.js',
  output: {
    publicPath,
    filename: `[name].bundle.js?v=${version}`,
    chunkFilename: `[name].bundle.js?v=${version}`,
    path: resolve(__dirname, 'dist'),
  },
  resolve: {
    modules: [
      `${__dirname}/node_modules`,
    ],
  },
  mode: process.env.NODE_ENV || 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevMode() ? `[name].css?v=${version}` : `[name].[hash].css?v=${version}`,
      chunkFilename: isDevMode() ? `[id].css?v=${version}` : `[id].[hash].css?v=${version}`,
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'app', 'index.html'),
      favicon: resolve(__dirname, 'app', 'favicon.ico'),
      minify: isDevMode() ? false : {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new BaseHrefWebpackPlugin({
      baseHref: publicPath,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(svg|ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: `fonts/[name].[ext]?v=${version}`,
          },
        },
        include: [
          join(__dirname, 'node_modules', 'material-design-icons'),
          join(__dirname, 'node_modules', 'materialize-css'),
          join(__dirname, 'node_modules', 'material-icons'),
        ],
      },
      {
        test: /\.(css|sass|scss)$/i,
        use: [
          isDevMode() ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
        include: [
          join(__dirname, 'node_modules', 'material-design-icons'),
          join(__dirname, 'node_modules', 'materialize-css'),
          join(__dirname, 'node_modules', 'material-icons'),
          join(__dirname, 'app'),
        ],
      },
    ],
  },
  // production:
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({ /* TODO */ }),
    ],
  },
  node: {
    fs: 'empty',
    'child_process': 'empty',
    // console: false,
    // net: 'empty',
    // tls: 'empty',
  },
};

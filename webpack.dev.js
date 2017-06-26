const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const paths = require('./paths');

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    polyfills: paths.polyfills,
    main: ['webpack-hot-middleware/client', paths.main],
  },

  output: {
    path: paths.dist,
    publicPath: paths.publicPath,
    filename: '[name].bundle.js',
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [{
      test: /\.html$/,
      use: 'html-loader',
    }, {
      test: /\.(?:sa|s?c)ss$/,
      include: paths.clientApp,
      use: ['to-string-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.(?:sa|s?c)ss$/,
      exclude: paths.clientApp,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.ts$/,
      use: ['awesome-typescript-loader', 'angular2-template-loader'],
    }, {
      test: /\.(?:gif|png|jpe?g|svg|ttf|eot|woff2?)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    }],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ContextReplacementPlugin(
      /angular(?:\\|\/)core(?:\\|\/)@angular/,
      paths.client,
      {}
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfills',
      minChunks: Infinity,
    }),
    new HTMLPlugin({
      template: paths.index,
    }),
  ],
};

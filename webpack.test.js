const webpack = require('webpack');

const paths = require('./paths');

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [{
      test: /\.html$/,
      use: 'raw-loader',
    }, {
      test: /\.(?:sa|s?c)ss$/,
      include: paths.clientApp,
      use: ['to-string-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.(?:sa|s?c)ss$/,
      exclude: paths.clientApp,
      use: 'null-loader',
    }, {
      test: /\.ts$/,
      use: ['awesome-typescript-loader', 'angular2-template-loader'],
    }, {
      test: /\.(?:gif|png|jpe?g|svg|ttf|eot|woff2?)$/,
      use: 'null-loader',
    }],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ContextReplacementPlugin(
      /angular(?:\\|\/)core(?:\\|\/)@angular/,
      paths.client,
      {}
    ),
  ],
};

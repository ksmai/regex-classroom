const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

const paths = require('./paths');

module.exports = {
  devtool: 'source-map',

  entry: {
    server: paths.serverApp,
  },

  output: {
    filename: 'server.bundle.js',
    path: paths.dist,
    libraryTarget: 'commonjs2',
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  target: 'node',

  node: {
    __dirname: true,
    __filename: true,
  },

  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'awesome-typescript-loader',
      },
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
    }),
  ],
};

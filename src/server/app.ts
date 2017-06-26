import * as express from 'express';

const paths = require('../../paths');

export const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(paths.dist));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: paths.dist });
  });
} else {
  const historyApiFallback = require('connect-history-api-fallback');
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../../webpack.dev');
  const compiler = webpack(webpackConfig);
  const instance = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: paths.publicPath,
  });
  app.use(instance);
  app.use(webpackHotMiddleware(compiler, { reload: true }));
  app.use(historyApiFallback());
  app.use(instance);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${process.env.NODE_ENV} server running on port ${PORT}`);
});

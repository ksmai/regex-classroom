/* tslint:disable:no-console */
import * as express from 'express';
import * as mongoose from 'mongoose';

// provide ES6 promise to mongoose
(mongoose as any).Promise = Promise;
const MONGO_URL = process.env.MONGO_URL ||
  'mongodb://localhost:27017/regex-classroom';
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`Connected to mongoDB: ${MONGO_URL}`);
  })
  .catch((err) => {
    console.error(`Fail to connect to ${MONGO_URL}`);
    console.error(err.message || err);
    process.exit(1);
  });

export const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(require('compression')());
  app.use(require('helmet')());
  const paths = require('../../paths');
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
    publicPath: webpackConfig.output.publicPath,
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

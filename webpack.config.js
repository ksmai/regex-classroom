switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./webpack.prod');
    break;

  case 'test':
    module.exports = require('./webpack.test');
    break;

  case 'dev':
  case 'development':
  default:
    module.exports = require('./webpack.dev');
}

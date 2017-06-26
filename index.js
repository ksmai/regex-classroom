if (process.env.NODE_ENV === 'production') {
  require('./dist/server.bundle');
} else {
  require('ts-node/register');
  require('./src/server/app.ts');
}

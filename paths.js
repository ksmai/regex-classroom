const path = require('path');

exports.publicPath = '/';
exports.assets = path.resolve(__dirname, 'assets');
exports.dist = path.resolve(__dirname, 'dist');
exports.src = path.resolve(__dirname, 'src');
exports.tsConfigPath = path.resolve(__dirname, 'tsconfig.json');

exports.client = path.join(exports.src, 'client');
exports.server = path.join(exports.src, 'server');
exports.favicon = path.join(exports.assets, 'favicon.svg');

exports.index = path.join(exports.client, 'index.html');
exports.polyfills = path.join(exports.client, 'polyfills.ts');
exports.main = path.join(exports.client, 'main.ts');
exports.clientApp = path.join(exports.client, 'app');
exports.serverApp = path.join(exports.server, 'app.ts');

exports.entryModule = path.join(exports.clientApp, 'app.module#AppModule');

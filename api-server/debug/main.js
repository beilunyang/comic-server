'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _kcors = require('kcors');

var _kcors2 = _interopRequireDefault(_kcors);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// error handle
process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  _log2.default.error('uncaughtException:', err);
});

const app = new _koa2.default();

_utils.db.init();
app.use((0, _kcors2.default)());
app.use((0, _koaBodyparser2.default)());
app.use(_routes2.default.routes());

const port = _config2.default[process.env.NODE_ENV || 'develop'].port;

exports.default = app.listen(port, () => {
  _log2.default.info(`server listen at ${port}`);
});
//# sourceMappingURL=main.js.map
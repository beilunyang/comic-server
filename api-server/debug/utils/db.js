'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _log = require('../log');

var _log2 = _interopRequireDefault(_log);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { host, database, user, password } = _config2.default[process.env.NODE_ENV || 'develop'].mongodb;
let status = 'DISCONNETED';
_mongoose2.default.Promise = global.Promise;
const init = () => {
  if (status === 'DISCONNETED') {
    let mongoUrl = `mongodb://${host}/${database}`;
    if (user && password) {
      mongoUrl = `mongodb://${user}:${password}@${host}:27017/${database}?authSource=admin`;
    }
    _mongoose2.default.connect(mongoUrl);
    status = 'CONNECTING';
    const db = _mongoose2.default.connection;
    return new Promise((resolve, reject) => {
      db.on('error', err => {
        status = 'DISCONNETED';
        _log2.default.error(err);
        reject(err);
      });
      db.once('open', () => {
        status = 'CONNECTED';
        _log2.default.info('Database connected');
        resolve();
      });
    });
  }
};

exports.default = { init };
//# sourceMappingURL=db.js.map
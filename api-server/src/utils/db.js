const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./log').dbLogger;

const { host, database, user, password } = config[process.env.NODE_ENV || 'develop'].mongodb;
let status = 'DISCONNETED';
mongoose.Promise = global.Promise;
const init = () => {
  if (status === 'DISCONNETED') {
    let mongoUrl = `mongodb://${host}/${database}`;
    if (user && password) {
      mongoUrl = `mongodb://${user}:${password}@${host}:27017/${database}?authSource=admin`;
    }
    mongoose.connect(mongoUrl);
    status = 'CONNECTING';
    const db = mongoose.connection;
    return new Promise((resolve, reject) => {
      db.on('error', err => {
        status = 'DISCONNETED';
        logger.error(err);
        reject(err);
      });
      db.once('open', () => {
        status = 'CONNECTED';
        logger.info('Database connected');
        resolve();
      });
    });
  }
};

module.exports = { init };

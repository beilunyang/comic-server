const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const moment = require('moment');

const formatTime = () => moment().format('YYYY-MM-DD HH:mm:ss:SSS');

let logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      timestamp: formatTime,
    }),
  ],
});

logger.dbLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      timestamp: formatTime,
    }),
  ],
});

if (process.env.NODE_ENV === 'production') {
  const allTransport = new DailyRotateFile({
    name: 'all',
    filename: '/log/all.log',
    level: 'info',
    colorize: true,
    maxsize: 1024 * 1024 * 10,
    datePattern: '.yyyy-MM-dd',
    localTime: true,
    timestamp: formatTime,
  });


  const errorTransport = new DailyRotateFile({
    name: 'error',
    filename: '/log/error.log',
    level: 'error',
    colorize: true,
    maxsize: 1024 * 1024 * 10,
    datePattern: '.yyyy-MM-dd',
    localTime: true,
    timestamp: formatTime,
  });

  const dbTransport = new DailyRotateFile({
    name: 'db',
    filename: '/log/db.log',
    level: 'info',
    colorize: true,
    maxsize: 1024 * 1024 * 10,
    datePattern: '.yyyy-MM-dd',
    localTime: true,
    timestamp: formatTime,
  });


  logger = new winston.Logger({
    transports: [
      allTransport,
      errorTransport
    ],
  });

  logger.dbLogger = new winston.Logger({
    transports: [
      allTransport,
      errorTransport,
      dbTransport
    ],
  });

  /* eslint-disable no-unused-vars */
  const crashLogger = new winston.Logger({
    transports: [
      new winston.transports.File({
        name: 'error',
        filename: '/log/crash.log',
        level: 'error',
        handleExceptions: true,
        humanReadableUnhandledException: true,
        colorize: true,
        json: false,
        timestamp: formatTime,
      }),
    ],
  });
}

module.exports = logger;



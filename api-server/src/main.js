const Koa = require('koa');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const winston = require('winston');
const { logger: reqLogger } = require('koa2-winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const moment = require('moment');
const config = require('./config');
const router = require('./routes');
const { db, logger } = require('./utils');

const app = new Koa();

db.init();
app.use(cors());
app.use(bodyParser());

const formatTime = () => moment().format('YYYY-MM-DD HH:mm:ss:SSS');
if (app.env === 'production') {
  app.use(reqLogger({
    transports: [
      new DailyRotateFile({
        name: 'http',
        filename: '/log/http.log',
        colorize: true,
        maxsize: 1024 * 1024 * 10,
        datePattern: '.yyyy-MM-dd',
        localTime: true,
        timestamp: formatTime,
        json: true,
      })
    ],
    level: 'info',
  }));
} else {
  app.use(reqLogger({
    transports: [
      new winston.transports.Console({
        json: false,
        colorize: true,
        timestamp: formatTime,
        level: 'info',
      }),
    ],
    level: 'info',
  }));
}

app.use(router.routes());

const port = config[app.env || 'develop'].port;

app.listen(port, () => logger.info(`server listen at ${port}`));

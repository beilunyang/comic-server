import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
// import log4js from 'log4js';
import config from 'config';
import router from 'routes';
import cors from 'kcors';
import { db } from 'utils';

// log4js.configure({
//   appenders: [
//     {
//       type: 'console',
//     },
//     {
//       type: 'file',
//       maxLogSize: 2048,
//       numBackups: 10,
//       filename: 'log/app.log',
//     },
//     {
//       type: 'DateFile',
//       filename: 'log/access.log',
//       category: 'http',
//       pattern: '-yyyy-MM-dd',
//     },
//     {
//       type: 'logLevelFilter',
//       level: 'ERROR',
//       appenders: {
//         type: 'file',
//         filename: 'log/error.log',
//       },
//     }
//   ]
// });
// const logger = log4js.getLogger();

// error handle
process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  console.error('uncaughtException:', err);
});

const app = new Koa();

db.init();
app.use(cors());
app.use(bodyParser());
app.use(router.routes());

const port = config[process.env.NODE_ENV || 'develop'].port;

export default app.listen(port, () => {
  console.info(`server listen at ${port}`);
});

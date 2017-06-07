const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { logger: reqLogger } = require('koa2-winston');
const cors = require('kcors');
const config = require('./config');
const router = require('./routes');
const { db, logger } = require('./utils');

const app = new Koa();

db.init();
app.use(cors());
app.use(bodyParser());
app.use(reqLogger());
app.use(router.routes());

const port = config[process.env.NODE_ENV || 'develop'].port;

app.listen(port, () => logger.info(`server listen at ${port}`));

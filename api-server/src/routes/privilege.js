const Redis = require('ioredis');
const config = require('../config');
const logger = require('../utils').logger.dbLogger;

const sclient = new Redis({ db: 1, showFriendlyErrorStack: true, host: 'redis' });
sclient.on('error', err => logger.error(err));

exports.ensureLogin = async (ctx, next) => {
  const url = ctx.url;
  const excludeUrls = config.excludeUrls;
  for (const excludeUrl of excludeUrls) {
    if (url.indexOf(excludeUrl) === 0) {
      return await next();
    }
  }

  const session_id = ctx.header.authorization;
  if (!session_id) {
    ctx.throw(401, '验证失败');
  } else {
    const openid = await sclient.get(session_id);
    if (openid) {
      ctx.state.openid = openid;
      await next();
    } else {
      ctx.throw(401, '验证失败');
    }
  }
};



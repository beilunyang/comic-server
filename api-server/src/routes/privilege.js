import Redis from 'ioredis';
import config from '../config';

const sclient = new Redis({ db: 1, showFriendlyErrorStack: true });
sclient.on('error', err => console.error(err.message));

export const ensureLogin = async (ctx, next) => {
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



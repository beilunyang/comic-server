const Router = require('koa-router');
const axios = require('axios');
const Redis = require('ioredis');
const crypto = require('crypto');
const config = require('../config');
const { User } = require('../models');
const logger = require('../utils').logger.dbLogger;

const sclient = new Redis({ db: 1 });
sclient.on('error', err => logger.error(err));

const router = new Router();

router.post('/', async (ctx) => {
  const { code, rawData, signature } = ctx.request.body;
  if (code) {
    const { appid, secret } = config.wx;
    const result = await axios
      .get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`);
    const { openid, expires_in, session_key } = result.data;
    const sha1 = crypto.createHash('sha1');
    sha1.update(rawData + session_key);
    const sign = sha1.digest('hex');
    if (sign !== signature) {
      return ctx.throw(400, '签名验证失败');
    }
    const md5 = crypto.createHash('md5');
    const srand = (Date.now() + Math.random() * 1000000).toString();
    md5.update(srand);
    const skey = md5.digest('hex');
    sclient.set(skey, openid, 'EX', expires_in - 60 * 10);

    const { nickName, avatarUrl } = JSON.parse(rawData);
    await User.findOneAndUpdate(openid, { nickName, avatarUrl, openid }, { upsert: true });
    ctx.body = { session_id: skey };
  } else {
    ctx.throw(400, 'code query required');
  }
});

module.exports = router;

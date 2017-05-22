import Router from 'koa-router';
import axios from 'axios';
import redis from 'redis';
import crypto from 'crypto';
import config from '../config';
import { User } from '../models';

const client = redis.createClient();
client.on('error', err => console.error(err.message));

const router = new Router();

router.post('/', async (ctx) => {
  const { code, rawData } = ctx.request.body;
  if (code) {
    const { appid, secret } = config.wx;
    const result = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`);
    const { openid, expires_in } = result.data;
    const md5 = crypto.createHash('md5');
    const srand = (Date.now() + Math.random() * 1000000).toString();
    md5.update(srand);
    const skey = md5.digest('hex');
    client.set(skey, openid, 'EX', expires_in - 600);
    const { nickName, avatarUrl } = JSON.parse(rawData);
    await User.findOneAndUpdate(openid, { nickName, avatarUrl, openid }, { upsert: true });
    ctx.body = { session_id: skey };
  } else {
    ctx.throw(400, 'code query required');
  }
});

export default router;

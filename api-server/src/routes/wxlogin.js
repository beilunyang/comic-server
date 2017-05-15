import Router from 'koa-router';
import axios from 'axios';
import config from '../config';

const router = new Router();

router.get('/', async (ctx) => {
  const code = ctx.query.code;
  if (code) {
    const { appid, secret } = config.wx;
    const result = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`);
    ctx.body = result.data;
  } else {
    ctx.throw(400, 'code query required');
  }
});

export default router;

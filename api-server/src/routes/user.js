import Router from 'koa-router';
import Redis from 'ioredis';

// record
const client = new Redis({ db: 2, showFriendlyErrorStack: true });
client.on('error', err => console.error(err.message));

// collection
const colClient = new Redis({ db: 3, showFriendlyErrorStack: true });
colClient.on('error', err => console.error(err.message));

const router = new Router();

router.post('/record', async (ctx) => {
  console.log('add a read record');
  const record = ctx.request.body;
  if (record) {
    const { mid, pid, cover, title } = record;
    const mc = JSON.stringify({ pid, cover, title });
    const openid = ctx.state.openid;
    await client.hset(openid, mid, mc);
    await client.expire(openid, 7 * 24 * 60 * 60);
    ctx.body = {
      status: 'ok',
      message: '新增阅读记录成功',
    };
  } else {
    ctx.body = {
      status: 'fail',
      message: '新增阅读记录失败',
    };
  }
});

router.get('/record', async (ctx) => {
  console.log('get read records');
  const openid = ctx.state.openid;
  ctx.body = await client.hgetall(openid);
});

router.post('/collection', (ctx) => {
  console.log('add a collection');
});

router.get('/collection', (ctx) => {
  console.log('get collections');
});

export default router;

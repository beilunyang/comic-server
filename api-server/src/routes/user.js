import Router from 'koa-router';
import { Record, Collection } from '../models';

const router = new Router();

router.post('/record', async (ctx) => {
  console.log('add a read record');
  const record = ctx.request.body;
  if (record) {
    const { mid, pid, cover, title } = record;
    const openid = ctx.state.openid;
    await Record.findOneAndUpdate({ mid }, { openid, mid, pid, cover, title }, { upsert: true });
    ctx.body = {
      status: 'ok',
      message: '新增阅读记录成功',
    };
  } else {
    ctx.throw(400, '内容不能为空');
  }
});

router.get('/record', async (ctx) => {
  console.log('get read records');
  const openid = ctx.state.openid;
  ctx.body = await Record.find({ openid }).select('-__id -_v');
});

router.post('/collection', async (ctx) => {
  console.log('add a collection');
  const collection = ctx.request.body;
  if (collection) {
    const { title, mid, cover } = collection;
    const openid = ctx.state.openid;
    await Collection.save({ openid, title, mid, cover });
    ctx.body = {
      status: 'ok',
      message: '收藏成功',
    };
  } else {
    ctx.throw(400, '内容不能为空');
  }
});

router.get('/collection', async (ctx) => {
  console.log('get collections');
  const openid = ctx.state.openid;
  ctx.body = await Collection.find({ openid }).select('-__id -_v');
});

export default router;

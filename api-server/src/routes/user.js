import Router from 'koa-router';
import { Record, Collection } from '../models';

const router = new Router();

router.post('/record', async (ctx) => {
  console.log('add a read record');
  const record = ctx.request.body;
  if (record) {
    const { mid, pid, origin_cover, title } = record;
    const openid = ctx.state.openid;
    await Record.findOneAndUpdate({ mid }, { openid, mid, pid, origin_cover, title }, { upsert: true });
    ctx.body = {
      status: 'ok',
      message: '新增阅读记录成功',
    };
  } else {
    ctx.throw(400, '内容不能为空');
  }
});

router.get('/record/:mid', async (ctx) => {
  console.log('get read record some comic');
  const openid = ctx.state.openid;
  const mid = Number(ctx.params.mid);
  if (isNaN(mid)) {
    return ctx.throw(400, '无效的mid');
  }
  ctx.body = await Record.findOne({ openid, mid }).select('-_id pid title').exec();
});

router.get('/record', async (ctx) => {
  console.log('get read records');
  const openid = ctx.state.openid;
  const comics = await Record.find({ openid }).limit(30).select('-_id -__v').exec();
  ctx.body = comics || [];
});

router.get('/collection/:mid', async (ctx) => {
  console.log('get a collection');
  const openid = ctx.state.openid;
  const mid = Number(ctx.params.mid);
  if (isNaN(mid)) {
    return ctx.throw(400, '无效的mid');
  }
  const result = await Collection.findOne({ openid, mid }).exec();
  if (result) {
    ctx.body = {
      status: 'ok',
      message: 'in collections',
    };
  } else {
    ctx.body = {
      status: 'fail',
      message: 'not in collections',
    };
  }
});

router.get('/collection/page/:page', async (ctx) => {
  console.log('get collections');
  const openid = ctx.state.openid;
  let page = Number(ctx.params.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  if (page !== 1) {
    const comics = await Collection.find({ openid }).skip((page - 1) * 15).limit(15).select('-__id -_v').exec();
    ctx.body = { comics: comics || [] };
    return;
  }
  const [comics, total] = await Promise.all([
    Collection.find({ openid }).skip((page - 1) * 15).limit(15).select('-__id -_v').exec(),
    Collection.count(),
  ]);
  ctx.body = {
    comics: comics || [],
    total,
  };
});

router.post('/collection', async (ctx) => {
  console.log('add a collection');
  const collection = ctx.request.body;
  if (collection) {
    const { mid, origin_cover, title, authors } = collection;
    const openid = ctx.state.openid;
    await Collection.findOneAndUpdate({ mid, openid }, { openid, mid, authors, origin_cover, title }, { upsert: true });
    ctx.body = {
      status: 'ok',
      message: '收藏成功',
    };
  } else {
    ctx.throw(400, '内容不能为空');
  }
});

router.post('/de_collection', async (ctx) => {
  console.log('cancel a collection');
  const { mid } = ctx.request.body;
  if (mid) {
    const openid = ctx.state.openid;
    await Collection.findOneAndRemove({ mid, openid });
    ctx.body = {
      status: 'ok',
      message: '取消收藏成功',
    };
  } else {
    ctx.throw(400, 'mid无效');
  }
});

export default router;

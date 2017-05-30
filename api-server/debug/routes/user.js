'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default();

router.post('/record', async ctx => {
  console.log('add a read record');
  const record = ctx.request.body;
  if (record) {
    const { mid, pid, cover, title } = record;
    const openid = ctx.state.openid;
    await _models.Record.findOneAndUpdate({ mid }, { openid, mid, pid, cover, title }, { upsert: true });
    ctx.body = {
      status: 'ok',
      message: '新增阅读记录成功'
    };
  } else {
    ctx.throw(400, '内容不能为空');
  }
});

router.get('/record/:mid', async ctx => {
  console.log('get read record some comic');
  const openid = ctx.state.openid;
  const mid = Number(ctx.params.mid);
  if (isNaN(mid)) {
    return ctx.throw(400, '无效的mid');
  }
  ctx.body = await _models.Record.findOne({ openid, mid }).select('-_id pid title');
});

router.get('/record', async ctx => {
  console.log('get read records');
  const openid = ctx.state.openid;
  ctx.body = await _models.Record.find({ openid }).limit(30).select('-_id -__v');
});

router.post('/collection', async ctx => {
  console.log('add a collection');
  const collection = ctx.request.body;
  if (collection) {
    const { title, mid, cover } = collection;
    const openid = ctx.state.openid;
    await _models.Collection.save({ openid, title, mid, cover });
    ctx.body = {
      status: 'ok',
      message: '收藏成功'
    };
  } else {
    ctx.throw(400, '内容不能为空');
  }
});

router.get('/collection', async ctx => {
  console.log('get collections');
  const openid = ctx.state.openid;
  ctx.body = await _models.Collection.find({ openid }).select('-__id -_v');
});

exports.default = router;
//# sourceMappingURL=user.js.map
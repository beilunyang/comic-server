'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default();

router.get('/page/:page', async ctx => {
  console.log('get ComicList');
  let page = Number(ctx.params.page);
  if (isNaN(page) || !page) {
    page = 1;
  }
  ctx.body = await _models.Comic.find().skip((page - 1) * 15).limit(15).select('-__v').exec();
});

router.get('/cate', async ctx => {
  console.log('get cate');
  ctx.body = await _models.Cate.find().select('-__v').exec();
});

router.get('/cate/:cate/page/:page', async ctx => {
  console.log('get cate comic');
  let page = Number(ctx.params.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  if (page === 1) {
    const [comics, total] = await Promise.all([_models.Comic.find({
      types: { $in: [ctx.params.cate] }
    }).skip((page - 1) * 15).limit(15).select('-__v -_id').exec(), _models.Comic.find({
      types: { $in: [ctx.params.cate] }
    }).count()]);
    ctx.body = {
      total,
      comics
    };
    return;
  }
  ctx.body = await _models.Comic.find({
    types: { $in: [ctx.params.cate] }
  }).skip((page - 1) * 15).limit(15).select('-__v -_id').exec();
});

router.get('/search/:keyword/page/:page', async ctx => {
  console.log('search');
  const regx = new RegExp(ctx.params.keyword, 'i');
  let page = Number(ctx.params.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  if (page === 1) {
    const [comics, total] = await Promise.all([_models.Comic.find({
      $or: [{
        title: regx
      }, {
        authors: { $in: [regx] }
      }]
    }).skip((page - 1) * 15).limit(15).select('-__v -_id').exec(), _models.Comic.find({
      $or: [{
        title: regx
      }, {
        authors: { $in: [regx] }
      }]
    }).count()]);
    ctx.body = {
      total,
      comics
    };
    return;
  }
  ctx.body = await _models.Comic.find({
    $or: [{
      title: regx
    }, {
      authors: { $in: [regx] }
    }]
  }).skip((page - 1) * 15).limit(15).select('-__v -_id').exec();
});

router.get('/theme', async ctx => {
  console.log('get themes');
  ctx.body = await _models.Theme.find();
});

router.get('/recommend', async ctx => {
  console.log('get recommend');
  ctx.body = await _models.Recommend.find();
});

router.get('/:mid/chapter/:pid', async ctx => {
  console.log('get comic chapter');
  const mid = Number(ctx.params.mid);
  const pid = Number(ctx.params.pid);
  ctx.body = await _models.Chapter.find({ mid, pid }).select('-__v -_id').exec();
});

router.get('/:mid', async ctx => {
  console.log('get comic');
  const mid = Number(ctx.params.mid);
  // TODO: 性能优化
  const comic = await _models.Comic.findOne({ mid }).select('-__v -_id').exec();
  const p = [];
  const c = comic.toObject();
  const cates = c.chapter_cates;
  for (const cate of cates) {
    p.push(_models.Chapter.find({ mid, cate }).select('-__v -_id').sort({ order: -1 }).exec());
  }
  const chapters = await Promise.all(p);
  c.chapters = chapters;
  ctx.body = c;
});

exports.default = router;
//# sourceMappingURL=comic.js.map
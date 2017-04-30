import Router from 'koa-router';
import { Comic, Chapter, Theme, Cate, Recommend } from '../models';

const router = new Router();

router.get('/page/:page', async (ctx) => {
  console.log('get ComicList');
  let page = Number(ctx.params.page);
  if (isNaN(page) || !page) {
    page = 1;
  }
  ctx.body = await Comic.find().skip((page - 1) * 15).limit(15).select('-__v')
                      .exec();
});

router.get('/cate', async (ctx) => {
  console.log('get cate');
  ctx.body = await Cate.find().select('-__v').exec();
});


router.get('/cate/:cate/page/:page', async (ctx) => {
  console.log('get cate comic');
  let page = Number(ctx.params.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  ctx.body = await Comic.find({
    types: { $in: [ctx.params.cate] },
  }).skip((page - 1) * 15).limit(15).select('-__v -_id').exec();
});

router.get('/search/:field', async (ctx) => {
  console.log('search');
  const regx = new RegExp(ctx.params.field, 'i');
  ctx.body = await Comic.find({ $or: [
    {
      title: regx,
    },
    {
      authors: { $in: [regx] },
    },
  ]
  }).select('-__v -_id').exec();
});

router.get('/theme', async (ctx) => {
  console.log('get themes');
  ctx.body = await Theme.find();
});

router.get('/recommend', async (ctx) => {
  console.log('get recommend');
  ctx.body = await Recommend.find();
});

router.get('/:id', async (ctx) => {
  console.log('get chapter');
  let mid = Number(ctx.params.id);
  mid = 21996;
  // TODO: 性能优化
  const comic = await Comic.findOne({ mid }).select('-__v -_id').exec();
  const p = [];
  const c = comic.toObject();
  const cates = c.chapter_cates;
  for (const cate of cates) {
    p.push(Chapter.find({ mid, cate }).select('-__v -_id').sort({ order: -1 }).exec());
  }
  const chapters = await Promise.all(p);
  c.chapters = chapters;
  ctx.body = c;
});

export default router;

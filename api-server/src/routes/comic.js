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
  ctx.body = await Cate.find().select('-__v').sort({ _id: -1 }).exec();
});


router.get('/cate/:cate/page/:page', async (ctx) => {
  console.log('get cate comic');
  const cate = ctx.params.cate;
  let page = Number(ctx.params.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  if (page !== 1) {
    let comics = [];
    if (cate !== '全部') {
      comics = await Comic.find({
        types: { $in: [ctx.params.cate] },
      }).skip((page - 1) * 15).limit(15).select('-__v -_id').exec();
    } else {
      comics = await Comic.find().skip((page - 1) * 15).limit(15).select('-__v -_id').exec();
    }
    ctx.body = { comics: comics || [] };
    return;
  }

  let result = [];
  if (cate !== '全部') {
    result = await Promise.all([
      Comic.find({
        types: { $in: [ctx.params.cate] },
      }).skip((page - 1) * 15).limit(15).select('-__v -_id').exec(),
      Comic.find({
        types: { $in: [ctx.params.cate] },
      }).count(),
    ]);
  } else {
    result = await Promise.all([
      Comic.find().skip((page - 1) * 15).limit(15).select('-__v -_id').exec(),
      Comic.find().count(),
    ]);
  }
  const [comics, total] = result;
  ctx.body = {
    total,
    comics: comics || [],
  };
});

router.get('/search/:keyword/page/:page', async (ctx) => {
  console.log('search');
  const regx = new RegExp(ctx.params.keyword, 'i');
  let page = Number(ctx.params.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  if (page !== 1) {
    const comics = await Comic.find({
      $or: [
        {
          title: regx,
        },
        {
          authors: { $in: [regx] },
        },
      ]
    }).skip((page - 1) * 15).limit(15).select('-__v -_id').exec();
    ctx.body = {
      comics: comics || [],
    };
    return;
  }
  const [comics, total] = await Promise.all([
    Comic.find({
      $or: [
        {
          title: regx,
        },
        {
          authors: { $in: [regx] },
        },
      ]
    }).skip((page - 1) * 15).limit(15).select('-__v -_id').exec(),
    Comic.find({
      $or: [
        {
          title: regx,
        },
        {
          authors: { $in: [regx] },
        },
      ]
    }).count(),
  ]);
  ctx.body = {
    total,
    comics: comics || [],
  };
});

router.get('/theme', async (ctx) => {
  console.log('get themes');
  ctx.body = await Theme.find();
});

router.get('/recommend', async (ctx) => {
  console.log('get recommend');
  ctx.body = await Recommend.find();
});

router.get('/:mid/chapter/:pid', async (ctx) => {
  console.log('get comic chapter');
  const mid = Number(ctx.params.mid);
  const pid = Number(ctx.params.pid);
  ctx.body = await Chapter.find({ mid, pid }).select('-__v -_id').exec();
});

router.get('/:mid', async (ctx) => {
  console.log('get comic');
  const mid = Number(ctx.params.mid);
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

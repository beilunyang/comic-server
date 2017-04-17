import Router from 'koa-router';
import { Comic, Chapter, Column, Cate } from '../models';

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

router.get('/:id', async (ctx) => {
  console.log('get chapter');
  const mid = Number(ctx.params.id);
  const [comic, chapters] = await Promise.all([
    Comic.findOne({ mid }).select('-__v -_id').exec(),
    Chapter.find({ mid }).select('-__v -_id').exec()
  ]);
  comic.chapters = chapters;
  ctx.body = comic;
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

router.get('/columns/:id', async (ctx) => {
  console.log('get columns');
  ctx.body = await Column.find({ cid: ctx.params.id });
});

export default router;

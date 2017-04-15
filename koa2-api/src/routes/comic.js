import Router from 'koa-router';
import { Comic, Chapter } from '../models';

const router = new Router();

router.get('/', async (ctx) => {
  console.log('get ComicList');
  let page = Number(ctx.params.page);
  if (isNaN(page) || !page) {
    page = 1;
  }
  ctx.body = await Comic.find().skip((page - 1) * 15).limit(15).select('-__v')
                      .exec();
});


// router.get('/:id', async (ctx) => {
//   console.log('get Bgm');
//   ctx.body = await Comic.findOne({ id: ctx.params.id }).select('-__v').exec();
// });

router.get('/:id', async (ctx) => {
  console.log('get chapterList');
  ctx.body = await Chapter.find({ comic_id: ctx.params.id }).exec();
});

// router.get('/chapter/:id', async (ctx) => {
//   console.log('get chapter');
//   ctx.body = await Chapter.findOne({ id: ctx.params.id }).select('-__v').exec();
// });

export default router;

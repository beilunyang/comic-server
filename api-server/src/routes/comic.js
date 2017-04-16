import Router from 'koa-router';
import { Comic, Chapter, Column } from '../models';

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


// router.get('/:id', async (ctx) => {
//   console.log('get Bgm');
//   ctx.body = await Comic.findOne({ id: ctx.params.id }).select('-__v').exec();
// });
// router.get('/comic/:id', async (ctx) => {
//   console.log('get comic');
//   ctx.body = await Comic.findOne({ id: ctx.params.id }).select('-__v').exec();
// });

router.get('/comic/:id', async (ctx) => {
  console.log('get chapter');
  ctx.body = await Chapter.findOne({ comic_id: ctx.params.id }).exec();
});

// router.get('/chapter/:id', async (ctx) => {
//   console.log('get chapter');
//   ctx.body = await Chapter.findOne({ id: ctx.params.id }).select('-__v').exec();
// });

router.get('/columns', async (ctx) => {
  console.log('get columns');
  ctx.body = await Column.find({});
});

export default router;

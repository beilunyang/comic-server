import Router from 'koa-router';
import user from './user';
import comic from './comic';
import { ensureLogin } from './privilege';
import { swagDocHandler } from '../utils';

const router = new Router({
  prefix: '/api/v1',
});

router.get('/', ctx => {
  ctx.body = 'HELLO WORLD';
});

// return swagger doc json data.
// open [http://swagger.daguchuangyi.com/?url=http://localhost:8888/swagger.json#!]
// to use Swagger UI to visualize the doc
router.get('/swagger.json', swagDocHandler);

router.use(ensureLogin);

// example user routes providing: [create|login|get] method.
router.use('/user', user.routes());

router.use('/comic', comic.routes());

export default router;

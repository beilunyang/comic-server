import Router from 'koa-router';
import comic from './comic';
import wxlogin from './wxlogin';
import user from './user';
import { ensureLogin } from './privilege';
import { swagDocHandler } from '../utils';

const router = new Router({
  prefix: '/api/v1',
});

router.use('/wxlogin', wxlogin.routes());

router.get('/swagger.json', swagDocHandler);

router.use(ensureLogin);

router.use('/comic', comic.routes());

router.use('/user', user.routes());

export default router;

const Router = require('koa-router');
const comic = require('./comic');
const wxlogin = require('./wxlogin');
const user = require('./user');
const { ensureLogin } = require('./privilege');
const { swagDocHandler } = require('../utils');

const router = new Router({
  prefix: '/api/v1',
});

router.use('/wxlogin', wxlogin.routes());

router.get('/swagger.json', swagDocHandler);

router.use(ensureLogin);

router.use('/comic', comic.routes());

router.use('/user', user.routes());

module.exports = router;

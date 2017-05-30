'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sclient = new _ioredis2.default({ db: 1 });
sclient.on('error', err => console.error(err.message));

const router = new _koaRouter2.default();

router.post('/', async ctx => {
  const { code, rawData } = ctx.request.body;
  if (code) {
    const { appid, secret } = _config2.default.wx;
    const result = await _axios2.default.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`);
    const { openid, expires_in } = result.data;
    const md5 = _crypto2.default.createHash('md5');
    const srand = (Date.now() + Math.random() * 1000000).toString();
    md5.update(srand);
    const skey = md5.digest('hex');
    sclient.set(skey, openid, 'EX', expires_in - 60 * 10);
    const { nickName, avatarUrl } = JSON.parse(rawData);
    await _models.User.findOneAndUpdate(openid, { nickName, avatarUrl, openid }, { upsert: true });
    ctx.body = { session_id: skey };
  } else {
    ctx.throw(400, 'code query required');
  }
});

exports.default = router;
//# sourceMappingURL=wxlogin.js.map
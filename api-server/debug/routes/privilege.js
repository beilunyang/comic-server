'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureLogin = undefined;

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sclient = new _ioredis2.default({ db: 1, showFriendlyErrorStack: true });
sclient.on('error', err => console.error(err.message));

const ensureLogin = exports.ensureLogin = async (ctx, next) => {
  const url = ctx.url;
  const excludeUrls = _config2.default.excludeUrls;
  for (const excludeUrl of excludeUrls) {
    if (url.indexOf(excludeUrl) === 0) {
      return await next();
    }
  }

  const session_id = ctx.header.authorization;
  if (!session_id) {
    ctx.throw(401, '验证失败');
  } else {
    const openid = await sclient.get(session_id);
    if (openid) {
      ctx.state.openid = openid;
      await next();
    } else {
      ctx.throw(401, '验证失败');
    }
  }
};
//# sourceMappingURL=privilege.js.map
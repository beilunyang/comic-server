'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _comic = require('./comic');

var _comic2 = _interopRequireDefault(_comic);

var _wxlogin = require('./wxlogin');

var _wxlogin2 = _interopRequireDefault(_wxlogin);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _privilege = require('./privilege');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default({
  prefix: '/api/v1'
});

router.use('/wxlogin', _wxlogin2.default.routes());

router.get('/swagger.json', _utils.swagDocHandler);

router.use(_privilege.ensureLogin);

router.use('/comic', _comic2.default.routes());

router.use('/user', _user2.default.routes());

exports.default = router;
//# sourceMappingURL=index.js.map
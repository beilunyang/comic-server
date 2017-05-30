'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;
const UserSchema = new Schema({
  nickName: String,
  openid: String,
  avatarUrl: String
});

const User = exports.User = _mongoose2.default.model('user', UserSchema);
//# sourceMappingURL=user.js.map
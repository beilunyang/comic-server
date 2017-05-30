'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Recommend = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RecommendSchema = _mongoose2.default.Schema({
  mid: {
    type: String
  },
  pic: {
    type: String
  }
});

const Recommend = exports.Recommend = _mongoose2.default.model('Recommend', RecommendSchema);
//# sourceMappingURL=recommend.js.map
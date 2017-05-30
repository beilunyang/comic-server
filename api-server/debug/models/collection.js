'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collection = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CollectionSchema = _mongoose2.default.Schema({
  title: String,
  mid: Number,
  cover: String,
  openid: String
});

CollectionSchema.index({ mid: 1 }, { unique: true });

const Collection = exports.Collection = _mongoose2.default.model('Collection', CollectionSchema);
//# sourceMappingURL=collection.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Record = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RecordSchema = _mongoose2.default.Schema({
  title: String,
  mid: Number,
  pid: Number,
  cover: String,
  openid: String
});

// RecordSchema.index({ mid: 1, pid: 1 }, { unique: true });

const Record = exports.Record = _mongoose2.default.model('Record', RecordSchema);
//# sourceMappingURL=record.js.map
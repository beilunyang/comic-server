'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cate = exports.Chapter = exports.Comic = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ComicSchema = _mongoose2.default.Schema({
  title: {
    type: String,
    required: true
  },
  origin_cover: {
    type: String,
    default: ''
  },
  mid: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  update_time: {
    type: Number,
    default: ''
  },
  types: {
    type: Array,
    default: []
  },
  finished: {
    type: Boolean,
    default: true
  },
  authors: {
    type: Array,
    default: []
  }
});
const ChapterSchema = _mongoose2.default.Schema({
  mid: {
    type: Number,
    required: true
  },
  pid: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  order: {
    type: Number
  },
  cate: {
    type: String,
    default: ''
  },
  origin_images: {
    type: Array,
    default: []
  }
});

const CateSchema = _mongoose2.default.Schema({
  name: {
    type: String,
    required: true
  }
});

ComicSchema.index({ mid: 1 }, { unique: true });
ChapterSchema.index({ pid: 1 }, { unique: true });
const Comic = exports.Comic = _mongoose2.default.model('Comic', ComicSchema);
const Chapter = exports.Chapter = _mongoose2.default.model('Chapter', ChapterSchema);
const Cate = exports.Cate = _mongoose2.default.model('Cate', CateSchema);
//# sourceMappingURL=comic.js.map
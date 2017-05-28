import mongoose from 'mongoose';

const ComicSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  origin_cover: {
    type: String,
    default: '',
  },
  mid: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  update_time: {
    type: Number,
    default: '',
  },
  types: {
    type: Array,
    default: [],
  },
  finished: {
    type: Boolean,
    default: true,
  },
  authors: {
    type: Array,
    default: [],
  },
});
const ChapterSchema = mongoose.Schema({
  mid: {
    type: Number,
    required: true,
  },
  pid: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
  },
  cate: {
    type: String,
    default: '',
  },
  origin_images: {
    type: Array,
    default: [],
  },
});

const CateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

ComicSchema.index({ mid: 1 }, { unique: true });
ChapterSchema.index({ pid: 1 }, { unique: true });
export const Comic = mongoose.model('Comic', ComicSchema);
export const Chapter = mongoose.model('Chapter', ChapterSchema);
export const Cate = mongoose.model('Cate', CateSchema);




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
  cover: {
    type: String,
    default: '',
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
  comic_id: {
    type: mongoose.Schema.Types.ObjectId,
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
  origin_content: {
    type: Array,
    default: [],
  },
  content: {
    type: Array,
    default: [],
  }
});

ComicSchema.index({ title: 1, description: 1 }, { unique: true });
ChapterSchema.index({ comic_id: 1, cate: 1, title: 1 }, { unique: true });
export const Comic = mongoose.model('Comic', ComicSchema);
export const Chapter = mongoose.model('Chapter', ChapterSchema);




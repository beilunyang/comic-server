import mongoose from 'mongoose';

const CollectionSchema = mongoose.Schema({
  title: String,
  mid: Number,
  origin_cover: String,
  openid: String,
  authors: Array,
});

CollectionSchema.index({ mid: 1, openid: 1 }, { unique: true });

export const Collection = mongoose.model('Collection', CollectionSchema);

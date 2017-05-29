import mongoose from 'mongoose';

const CollectionSchema = mongoose.Schema({
  title: String,
  mid: Number,
  cover: String,
  openid: String,
});

CollectionSchema.index({ mid: 1 }, { unique: true });

export const Collection = mongoose.model('Collection', CollectionSchema);

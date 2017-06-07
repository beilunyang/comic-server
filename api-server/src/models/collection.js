const mongoose = require('mongoose');

const CollectionSchema = mongoose.Schema({
  title: String,
  mid: Number,
  origin_cover: String,
  openid: String,
  authors: Array,
});

CollectionSchema.index({ mid: 1, openid: 1 }, { unique: true });

exports.Collection = mongoose.model('Collection', CollectionSchema);

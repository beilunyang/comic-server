const mongoose = require('mongoose');

const RecordSchema = mongoose.Schema({
  title: String,
  mid: Number,
  pid: Number,
  origin_cover: String,
  openid: String,
});

RecordSchema.index({ mid: 1, openid: 1 }, { unique: true });

exports.Record = mongoose.model('Record', RecordSchema);

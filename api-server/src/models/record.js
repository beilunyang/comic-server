import mongoose from 'mongoose';

const RecordSchema = mongoose.Schema({
  title: String,
  mid: Number,
  pid: Number,
  cover: String,
  openid: String,
});

// RecordSchema.index({ mid: 1, pid: 1 }, { unique: true });

export const Record = mongoose.model('Record', RecordSchema);

const mongoose = require('mongoose');

const SlideSchema = mongoose.Schema({
  mid: Number,
  cover: String,
  title: String,
});

SlideSchema.index({ mid: 1 }, { unique: true });

exports.Slide = mongoose.model('Slide', SlideSchema);

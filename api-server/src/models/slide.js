import mongoose from 'mongoose';

const SlideSchema = mongoose.Schema({
  mid: Number,
  cover: String,
  title: String,
});

SlideSchema.index({ mid: 1 }, { unique: true });

export const Slide = mongoose.model('Slide', SlideSchema);

import mongoose from 'mongoose';

const RecommendSchema = mongoose.Schema({
  mid: {
    type: String,
  },
  pic: {
    type: String,
  },
});

export const Recommend = mongoose.model('Recommend', RecommendSchema);

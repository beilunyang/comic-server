const mongoose = require('mongoose');

const RecommendSchema = mongoose.Schema({
  mid: {
    type: String,
  },
  pic: {
    type: String,
  },
});

exports.Recommend = mongoose.model('Recommend', RecommendSchema);

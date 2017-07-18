const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  nickName: String,
  openid: String,
  avatarUrl: String,
});

exports.User = mongoose.model('user', UserSchema);

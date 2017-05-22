import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  nickName: String,
  openid: String,
  avatarUrl: String,
});

export const User = mongoose.model('user', UserSchema);

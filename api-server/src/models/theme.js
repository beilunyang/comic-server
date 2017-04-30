import mongoose from 'mongoose';

const ThemeSchema = mongoose.Schema({
  title: String,
  comics: Array,
});

export const Theme = mongoose.model('Theme', ThemeSchema);

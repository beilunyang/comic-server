const mongoose = require('mongoose');

const ThemeSchema = mongoose.Schema({
  title: String,
  comics: Array,
});

exports.Theme = mongoose.model('Theme', ThemeSchema);

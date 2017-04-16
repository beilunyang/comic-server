import mongoose from 'mongoose';

const ColumnSchema = mongoose.Schema({
  title: String,
  comics: Array,
});

export const Column = mongoose.model('Column', ColumnSchema);

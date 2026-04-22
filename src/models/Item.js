const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Electronics', 'Personal Effects', 'Documents', 'Other'],
  },
  type: {
    type: String,
    required: [true, 'Please specify if it is Lost or Found'],
    enum: ['Lost', 'Found'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);

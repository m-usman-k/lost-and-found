const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Comment cannot be empty'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);

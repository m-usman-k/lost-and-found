const Comment = require('../models/Comment');
const Item = require('../models/Item');

// @desc    Get all comments for an item
// @route   GET /api/items/:itemId/comments
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ item: req.params.itemId })
      .populate('user', 'name')
      .sort('createdAt');
    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to an item
// @route   POST /api/items/:itemId/comments
exports.addComment = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      res.status(404);
      return next(new Error('Item not found'));
    }

    const comment = await Comment.create({
      item: req.params.itemId,
      user: req.user.id,
      text: req.body.text,
    });

    await comment.populate('user', 'name');
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment (owner or admin)
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404);
      return next(new Error('Comment not found'));
    }

    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Not authorized to delete this comment'));
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

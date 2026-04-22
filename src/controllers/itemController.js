const Item = require('../models/Item');

// @desc    Get all items
// @route   GET /api/items
exports.getItems = async (req, res, next) => {
  try {
    const items = await Item.find().populate('user', 'name email');
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new item
// @route   POST /api/items
exports.createItem = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const item = await Item.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name email');
    if (!item) {
      res.status(404);
      return next(new Error(`Item not found with id of ${req.params.id}`));
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
exports.updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      return next(new Error(`Item not found with id of ${req.params.id}`));
    }

    // Make sure user is owner or admin
    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error(`User is not authorized to update this item`));
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      return next(new Error(`Item not found with id of ${req.params.id}`));
    }

    // Make sure user is owner or admin
    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error(`User is not authorized to delete this item`));
    }

    await item.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

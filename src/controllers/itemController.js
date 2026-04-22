const Item = require('../models/Item');

// @desc    Get all items (with filters)
// @route   GET /api/items
exports.getItems = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    
    // Fields to exclude from direct matching
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string for advanced operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Base query
    query = Item.find(JSON.parse(queryStr));

    // Keyword Search
    if (req.query.search) {
      query = query.find({
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { location: { $regex: req.query.search, $options: 'i' } }
        ]
      });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const items = await query.populate('user', 'name email');
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user items
// @route   GET /api/items/me
exports.getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ user: req.user.id });
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

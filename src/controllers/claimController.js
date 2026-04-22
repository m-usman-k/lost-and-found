const Claim = require('../models/Claim');
const Item = require('../models/Item');

// @desc    Submit a claim for a found item
// @route   POST /api/claims
exports.submitClaim = async (req, res, next) => {
  try {
    const { itemId, description } = req.body;
    
    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404);
      return next(new Error('Item not found'));
    }

    if (item.type !== 'Found') {
      res.status(400);
      return next(new Error('Claims can only be made for Found items'));
    }

    const claim = await Claim.create({
      item: itemId,
      user: req.user.id,
      description
    });

    res.status(201).json({ success: true, data: claim });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims (Admin only)
// @route   GET /api/claims
exports.getClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find()
      .populate('user', 'name email')
      .populate('item', 'title category type');
    res.status(200).json({ success: true, count: claims.length, data: claims });
  } catch (error) {
    next(error);
  }
};

// @desc    Update claim status (Only the person who found the item or Admin)
// @route   PUT /api/claims/:id
exports.updateClaimStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const claim = await Claim.findById(req.params.id).populate('item');

    if (!claim) {
      res.status(404);
      return next(new Error('Claim not found'));
    }

    // Authorization: Item owner (the one who found it) or Admin
    if (claim.item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Not authorized to update this claim status'));
    }

    claim.status = status;
    await claim.save();

    res.status(200).json({ success: true, data: claim });
  } catch (error) {
    next(error);
  }
};

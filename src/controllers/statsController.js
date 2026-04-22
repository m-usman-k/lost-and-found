const Item = require('../models/Item');
const User = require('../models/User');
const Claim = require('../models/Claim');

// @desc    Get dashboard statistics
// @route   GET /api/stats
exports.getStats = async (req, res, next) => {
  try {
    const totalItems = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ type: 'Lost' });
    const foundItems = await Item.countDocuments({ type: 'Found' });
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'Pending' });
    const approvedClaims = await Claim.countDocuments({ status: 'Approved' });
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        lostItems,
        foundItems,
        totalClaims,
        pendingClaims,
        approvedClaims,
        totalUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

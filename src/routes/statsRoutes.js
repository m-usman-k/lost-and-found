const express = require('express');
const { getStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin', 'user'), getStats);

module.exports = router;

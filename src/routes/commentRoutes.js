const express = require('express');
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// mergeParams allows access to :itemId from the parent router
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;

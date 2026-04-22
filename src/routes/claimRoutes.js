const express = require('express');
const { submitClaim, getClaims, updateClaimStatus } = require('../controllers/claimController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All claim routes require authentication

router.route('/')
  .post(submitClaim)
  .get(authorize('admin'), getClaims);

router.route('/:id')
  .put(updateClaimStatus);

module.exports = router;

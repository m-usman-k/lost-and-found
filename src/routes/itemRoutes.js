const express = require('express');
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
} = require('../controllers/itemController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, getMyItems);

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id')
  .get(getItem)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;

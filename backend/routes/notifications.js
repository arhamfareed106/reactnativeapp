const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const {
  getNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notification');

router.use(protect);

// User-specific routes
router.route('/my-notifications').get(getMyNotifications);
router.route('/mark-as-read/:id').put(markAsRead);
router.route('/mark-all-read').put(markAllAsRead);

// Admin routes
router.use(authorize('admin'));
router.route('/').get(getNotifications).post(createNotification);
router.route('/:id').get(getNotification).put(updateNotification).delete(deleteNotification);

module.exports = router;
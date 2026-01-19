const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const {
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getUserSubscriptions,
  cancelSubscription,
  renewSubscription,
  getSubscriptionStats,
  getPaymentHistory
} = require('../controllers/subscription');

// Include other resource routers
const paymentRouter = require('./payment');

// Re-route into other resource routers
router.use('/:subscriptionId/payments', paymentRouter);

// Admin routes
router
  .route('/')
  .get(protect, authorize('admin'), getSubscriptions)
  .post(protect, authorize('admin', 'company', 'worker'), createSubscription);

router
  .route('/:id')
  .get(protect, getSubscription)
  .put(protect, authorize('admin', 'company', 'worker'), updateSubscription)
  .delete(protect, authorize('admin'), deleteSubscription);

// User-specific routes
router.route('/my-subscriptions').get(protect, getUserSubscriptions);

// Subscription management routes
router.route('/:id/cancel').put(protect, cancelSubscription);
router.route('/:id/renew').put(protect, renewSubscription);

// Admin stats and analytics
router.route('/stats/overview').get(protect, authorize('admin'), getSubscriptionStats);
router.route('/payment-history').get(protect, authorize('admin'), getPaymentHistory);

module.exports = router;
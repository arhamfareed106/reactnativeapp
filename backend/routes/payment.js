const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

const {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment
} = require('../controllers/payment');

// Nested routes under subscription
router
  .route('/')
  .get(protect, authorize('admin', 'company', 'worker'), getPayments)
  .post(protect, authorize('admin', 'company', 'worker'), createPayment);

router
  .route('/:id')
  .get(protect, authorize('admin', 'company', 'worker'), getPayment)
  .put(protect, authorize('admin'), updatePayment)
  .delete(protect, authorize('admin'), deletePayment);

module.exports = router;
const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const {
  getShifts,
  getShift,
  createShift,
  updateShift,
  deleteShift,
  getCompanyShifts,
  getWorkerShifts,
  getShiftsByDate,
  getAvailableShifts
} = require('../controllers/shift');

router.use(protect);

// Public route for available shifts
router.route('/available').get(getAvailableShifts);

// Company and worker routes
router.route('/company/:companyId').get(protect, getCompanyShifts);
router.route('/worker/:workerId').get(protect, getWorkerShifts);
router.route('/date/:date').get(protect, getShiftsByDate);

// Admin routes
router.use(authorize('admin'));
router.route('/').post(createShift);
router.route('/:id').get(getShift).put(updateShift).delete(deleteShift);

module.exports = router;
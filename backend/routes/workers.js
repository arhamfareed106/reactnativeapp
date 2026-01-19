const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const {
  getWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker,
  getMyWorker,
  updateMyWorker,
  getWorkerTrainingProgress,
  getWorkerShifts,
  getWorkerCompanies
} = require('../controllers/worker');

router.use(protect);

// Routes for worker users
router.route('/my-worker').get(getMyWorker).put(updateMyWorker);

// Public route for worker profiles
router.route('/').get(getWorkers);

// Admin routes
router.use(authorize('admin'));
router.route('/').post(createWorker);
router.route('/:id').get(getWorker).put(updateWorker).delete(deleteWorker);

// Nested routes
router.route('/:id/training-progress').get(getWorkerTrainingProgress);
router.route('/:id/shifts').get(getWorkerShifts);
router.route('/:id/companies').get(getWorkerCompanies);

module.exports = router;
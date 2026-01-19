const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const {
  getTrainers,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getMyTrainer,
  updateMyTrainer,
  getTrainerTrainingPrograms,
  getTrainerAssignedWorkers
} = require('../controllers/trainer');

router.use(protect);

// Routes for trainer users
router.route('/my-trainer').get(getMyTrainer).put(updateMyTrainer);

// Admin routes
router.use(authorize('admin'));
router.route('/').get(getTrainers).post(createTrainer);
router.route('/:id').get(getTrainer).put(updateTrainer).delete(deleteTrainer);

// Nested routes
router.route('/:id/training-programs').get(getTrainerTrainingPrograms);
router.route('/:id/assigned-workers').get(getTrainerAssignedWorkers);

module.exports = router;
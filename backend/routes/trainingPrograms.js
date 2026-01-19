const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const {
  getTrainingPrograms,
  getTrainingProgram,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
  getCompanyTrainingPrograms,
  getTrainerTrainingPrograms
} = require('../controllers/trainingProgram');

router.use(protect);

// Public route for training programs
router.route('/').get(getTrainingPrograms);

// Company and trainer routes
router.route('/company/:companyId').get(protect, getCompanyTrainingPrograms);
router.route('/trainer/:trainerId').get(protect, getTrainerTrainingPrograms);

// Admin routes
router.use(authorize('admin'));
router.route('/').post(createTrainingProgram);
router.route('/:id').get(getTrainingProgram).put(updateTrainingProgram).delete(deleteTrainingProgram);

module.exports = router;
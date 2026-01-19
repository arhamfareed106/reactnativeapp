const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getMyCompany,
  updateMyCompany,
  getCompanyJobRoles,
  getCompanyTrainingPrograms,
  getCompanyShifts
} = require('../controllers/company');

router.use(protect);

// Public route for company profiles
router.route('/').get(getCompanies);

// Routes for company users
router.route('/my-company').get(getMyCompany).put(updateMyCompany);

// Admin routes
router.use(authorize('admin'));
router.route('/').post(createCompany);
router.route('/:id').get(getCompany).put(updateCompany).delete(deleteCompany);

// Nested routes
router.route('/:id/job-roles').get(getCompanyJobRoles);
router.route('/:id/training-programs').get(getCompanyTrainingPrograms);
router.route('/:id/shifts').get(getCompanyShifts);

module.exports = router;
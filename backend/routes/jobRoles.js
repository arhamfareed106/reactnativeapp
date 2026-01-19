const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const {
  getJobRoles,
  getJobRole,
  createJobRole,
  updateJobRole,
  deleteJobRole,
  getCompanyJobRoles
} = require('../controllers/jobRole');

router.use(protect);

// Public route for job roles
router.route('/').get(getJobRoles);

// Company routes
router.route('/company/:companyId').get(protect, getCompanyJobRoles);

// Admin routes
router.use(authorize('admin'));
router.route('/').post(createJobRole);
router.route('/:id').get(getJobRole).put(updateJobRole).delete(deleteJobRole);

module.exports = router;
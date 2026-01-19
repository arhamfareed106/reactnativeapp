const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe
} = require('../controllers/user');

router.use(protect);

router.route('/me').get(getMe);
router.route('/update-me').put(updateMe);
router.route('/delete-me').delete(deleteMe);

router.use(authorize('admin'));

router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
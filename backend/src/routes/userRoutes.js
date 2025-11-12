const express = require('express');
const router = express.Router();
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  deleteUser,
  getUsersByRole,
  updateUserProfile
} = require('../controllers/userController');

// All routes require authentication
router.use(authMiddleware);

// Get all users (admin only)
router.get('/', requireAdmin, getAllUsers);

// Get users by role (admin only)
router.get('/role/:role', requireAdmin, getUsersByRole);

// Get user by ID
router.get('/:uid', getUserById);

// Update user profile
router.patch('/:uid', updateUserProfile);

// Delete user (admin only)
router.delete('/:uid', requireAdmin, deleteUser);

module.exports = router;

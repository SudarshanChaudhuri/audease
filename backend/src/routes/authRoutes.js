const express = require('express');
const { register, login, getMe, updateRole } = require('../controllers/authController');
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.patch('/role/:uid', authMiddleware, requireAdmin, updateRole);

module.exports = router;

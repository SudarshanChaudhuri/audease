const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/:uid', getNotifications);
router.patch('/markRead/:id', markAsRead);
router.post('/markAllRead/:uid', markAllAsRead);

module.exports = router;

const express = require('express');
const {
  getPendingBookings,
  approveBooking,
  rejectBooking,
  getAllBookings
} = require('../controllers/adminController');
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware, requireAdmin);

router.get('/pending', getPendingBookings);
router.post('/approve/:id', approveBooking);
router.post('/reject/:id', rejectBooking);
router.get('/all', getAllBookings);

module.exports = router;

const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  checkSlotAvailability
} = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Booking CRUD operations
router.post('/', createBooking);
router.get('/user/:uid', getUserBookings);
router.get('/checkAvailability', checkSlotAvailability);
router.get('/:id', getBookingById);
router.post('/cancel/:id', cancelBooking);

module.exports = router;

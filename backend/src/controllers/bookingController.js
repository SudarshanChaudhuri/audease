const { db, admin } = require('../config/firebaseAdmin');
const { checkAvailability, findAlternativeSlots } = require('../helpers/availabilityHelper');
const { sendNotification } = require('./notificationController');

/**
 * Create a new booking request
 */
async function createBooking(req, res) {
  try {
    const {
      eventTitle,
      eventType,
      date,
      startTime,
      endTime,
      auditoriumId,
      expectedAudience,
      description
    } = req.body;

    // Validate required fields
    if (!eventTitle || !eventType || !date || !startTime || !endTime || !auditoriumId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check availability
    const availability = await checkAvailability(auditoriumId, date, startTime, endTime);

    if (!availability.available) {
      return res.status(409).json({
        message: 'Time slot not available',
        conflicts: availability.conflicts
      });
    }

    // Create booking
    const bookingRef = await db.collection('bookings').add({
      eventTitle,
      eventType,
      date,
      startTime,
      endTime,
      auditoriumId,
      expectedAudience: expectedAudience || 0,
      description: description || '',
      createdBy: req.user.uid,
      createdByName: req.user.name,
      createdByEmail: req.user.email,
      status: 'pending',
      adminNote: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: bookingRef.id
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Get bookings created by a specific user
 */
async function getUserBookings(req, res) {
  try {
    const { uid } = req.params;

    // Users can only view their own bookings unless they're admin
    if (req.user.uid !== uid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Note: Using only a where filter avoids requiring a composite index.
    // We'll sort results in memory by createdAt desc for consistent ordering.
    const snapshot = await db.collection('bookings')
      .where('createdBy', '==', uid)
      .get();

    const bookings = [];
    snapshot.forEach(doc => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by createdAt (Timestamp) desc; fallback to 0 when missing
    bookings.sort((a, b) => {
      const aTs = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?._seconds ? a.createdAt._seconds * 1000 : 0);
      const bTs = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?._seconds ? b.createdAt._seconds * 1000 : 0);
      return bTs - aTs;
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Get booking by ID
 */
async function getBookingById(req, res) {
  try {
    const { id } = req.params;

    const doc = await db.collection('bookings').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = doc.data();

    // Check access permissions
    if (booking.createdBy !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      id: doc.id,
      ...booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Cancel a booking
 */
async function cancelBooking(req, res) {
  try {
    const { id } = req.params;

    const doc = await db.collection('bookings').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = doc.data();

    // Only the creator or admin can cancel
    if (booking.createdBy !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if booking is in the past
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({ message: 'Cannot cancel past bookings' });
    }

    // Update booking status
    await db.collection('bookings').doc(id).update({
      status: 'cancelled',
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      cancelledBy: req.user.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Check availability for a time slot
 */
async function checkSlotAvailability(req, res) {
  try {
    const { auditoriumId, date, startTime, endTime } = req.query;

    if (!auditoriumId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const availability = await checkAvailability(auditoriumId, date, startTime, endTime);

    if (availability.available) {
      res.json({
        available: true,
        message: 'Time slot is available'
      });
    } else {
      // Find alternative slots
      const duration = require('../helpers/availabilityHelper').parseTime(endTime) - 
                      require('../helpers/availabilityHelper').parseTime(startTime);
      const alternatives = await findAlternativeSlots(auditoriumId, date, duration);

      res.json({
        available: false,
        conflicts: availability.conflicts,
        alternatives
      });
    }
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  checkSlotAvailability
};

const { db, admin } = require('../config/firebaseAdmin');
const { sendNotification } = require('./notificationController');

/**
 * Get all pending bookings
 */
async function getPendingBookings(req, res) {
  try {
    // Removed orderBy to avoid composite index (status + createdAt)
    const snapshot = await db.collection('bookings')
      .where('status', '==', 'pending')
      .get();

    const bookings = [];
    snapshot.forEach(doc => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort in-memory by createdAt desc
    bookings.sort((a, b) => {
      const aTs = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?._seconds ? a.createdAt._seconds * 1000 : 0);
      const bTs = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?._seconds ? b.createdAt._seconds * 1000 : 0);
      return bTs - aTs;
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get pending bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Approve a booking
 */
async function approveBooking(req, res) {
  try {
    const { id } = req.params;
    const { adminNote = '' } = req.body;

    const doc = await db.collection('bookings').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = doc.data();

    // Update booking status
    await db.collection('bookings').doc(id).update({
      status: 'approved',
      adminNote,
      approvedBy: req.user.uid,
      approvedByName: req.user.name,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send notification to booking creator
    await sendNotification(
      booking.createdBy,
      'Booking Approved',
      `Your booking for "${booking.eventTitle}" on ${booking.date} has been approved.`,
      'approval'
    );

    res.json({ message: 'Booking approved successfully' });
  } catch (error) {
    console.error('Approve booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Reject a booking
 */
async function rejectBooking(req, res) {
  try {
    const { id } = req.params;
    const { adminNote = 'Booking rejected by admin' } = req.body;

    const doc = await db.collection('bookings').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = doc.data();

    // Update booking status
    await db.collection('bookings').doc(id).update({
      status: 'rejected',
      adminNote,
      rejectedBy: req.user.uid,
      rejectedByName: req.user.name,
      rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send notification to booking creator
    await sendNotification(
      booking.createdBy,
      'Booking Rejected',
      `Your booking for "${booking.eventTitle}" on ${booking.date} has been rejected. Reason: ${adminNote}`,
      'rejection'
    );

    res.json({ message: 'Booking rejected successfully' });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Get all bookings with optional filters
 */
async function getAllBookings(req, res) {
  try {
    const { status, date, auditoriumId } = req.query;

    let query = db.collection('bookings');

    if (status) {
      query = query.where('status', '==', status);
    }

    if (date) {
      query = query.where('date', '==', date);
    }

    if (auditoriumId) {
      query = query.where('auditoriumId', '==', auditoriumId);
    }

    // Removed orderBy to avoid composite index requirements with filters
    const snapshot = await query.get();

    const bookings = [];
    snapshot.forEach(doc => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort in-memory by createdAt desc
    bookings.sort((a, b) => {
      const aTs = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?._seconds ? a.createdAt._seconds * 1000 : 0);
      const bTs = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?._seconds ? b.createdAt._seconds * 1000 : 0);
      return bTs - aTs;
    });

    res.json({ bookings, total: bookings.length });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getPendingBookings,
  approveBooking,
  rejectBooking,
  getAllBookings
};

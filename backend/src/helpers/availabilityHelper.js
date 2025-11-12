const { db } = require('../config/firebaseAdmin');

/**
 * Check if a time slot is available for booking
 * @param {string} auditoriumId - The auditorium ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} startTime - Start time in HH:mm format
 * @param {string} endTime - End time in HH:mm format
 * @param {string} excludeBookingId - Optional booking ID to exclude (for updates)
 * @returns {Promise<{available: boolean, conflicts: Array}>}
 */
async function checkAvailability(auditoriumId, date, startTime, endTime, excludeBookingId = null) {
  try {
    // Query bookings for the same auditorium and date
    let query = db.collection('bookings')
      .where('auditoriumId', '==', auditoriumId)
      .where('date', '==', date)
      .where('status', 'in', ['pending', 'approved']);

    const snapshot = await query.get();

    const conflicts = [];
    const requestStart = parseTime(startTime);
    const requestEnd = parseTime(endTime);

    snapshot.forEach(doc => {
      const booking = doc.data();
      
      // Skip if this is the booking being updated
      if (excludeBookingId && doc.id === excludeBookingId) {
        return;
      }

      const bookingStart = parseTime(booking.startTime);
      const bookingEnd = parseTime(booking.endTime);

      // Check for overlap
      if (
        (requestStart >= bookingStart && requestStart < bookingEnd) ||
        (requestEnd > bookingStart && requestEnd <= bookingEnd) ||
        (requestStart <= bookingStart && requestEnd >= bookingEnd)
      ) {
        conflicts.push({
          id: doc.id,
          eventTitle: booking.eventTitle,
          startTime: booking.startTime,
          endTime: booking.endTime
        });
      }
    });

    return {
      available: conflicts.length === 0,
      conflicts
    };
  } catch (error) {
    console.error('Check availability error:', error);
    throw error;
  }
}

/**
 * Convert time string to minutes for comparison
 * @param {string} time - Time in HH:mm format
 * @returns {number} Minutes since midnight
 */
function parseTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Find alternative available slots for a given date and auditorium
 * @param {string} auditoriumId - The auditorium ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} durationMinutes - Required duration in minutes
 * @returns {Promise<Array>} Array of available time slots
 */
async function findAlternativeSlots(auditoriumId, date, durationMinutes) {
  try {
    // Get all bookings for the day
    const snapshot = await db.collection('bookings')
      .where('auditoriumId', '==', auditoriumId)
      .where('date', '==', date)
      .where('status', 'in', ['pending', 'approved'])
      .get();

    const bookedSlots = [];
    snapshot.forEach(doc => {
      const booking = doc.data();
      bookedSlots.push({
        start: parseTime(booking.startTime),
        end: parseTime(booking.endTime)
      });
    });

    // Sort by start time
    bookedSlots.sort((a, b) => a.start - b.start);

    // Find gaps between bookings
    const availableSlots = [];
    const workingHours = { start: 480, end: 1200 }; // 8:00 AM to 8:00 PM

    let currentTime = workingHours.start;

    for (const slot of bookedSlots) {
      if (slot.start - currentTime >= durationMinutes) {
        availableSlots.push({
          startTime: formatTime(currentTime),
          endTime: formatTime(currentTime + durationMinutes)
        });
      }
      currentTime = Math.max(currentTime, slot.end);
    }

    // Check last slot until end of day
    if (workingHours.end - currentTime >= durationMinutes) {
      availableSlots.push({
        startTime: formatTime(currentTime),
        endTime: formatTime(currentTime + durationMinutes)
      });
    }

    return availableSlots;
  } catch (error) {
    console.error('Find alternative slots error:', error);
    throw error;
  }
}

/**
 * Convert minutes to time string
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time in HH:mm format
 */
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

module.exports = {
  checkAvailability,
  findAlternativeSlots,
  parseTime,
  formatTime
};

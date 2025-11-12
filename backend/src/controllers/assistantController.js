const { db } = require('../config/firebaseAdmin');
const { format, addDays, startOfWeek, endOfWeek } = require('date-fns');

/**
 * Get smart booking suggestions based on user's past bookings
 */
async function getSuggestions(req, res) {
  try {
    const userId = req.user.uid;

    // Get user's past bookings
    const bookingsRef = db.collection('bookings');
    const userBookings = await bookingsRef
      .where('userId', '==', userId)
      .where('status', '==', 'approved')
      .get();

    if (userBookings.empty) {
      return res.json({
        suggestions: [],
        message: 'No booking history found. Create your first booking to get personalized suggestions!'
      });
    }

    const bookings = [];
    userBookings.forEach(doc => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    // Analyze patterns
    const patterns = analyzeBookingPatterns(bookings);
    
    // Generate suggestions
    const suggestions = await generateSuggestions(patterns, userId);

    res.json({ suggestions, patterns });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ message: 'Failed to generate suggestions', error: error.message });
  }
}

/**
 * Find optimal booking time based on preferences
 */
async function findOptimalTime(req, res) {
  try {
    const { date, duration, auditoriumId } = req.body;
    const userId = req.user.uid;

    if (!date || !duration) {
      return res.status(400).json({ message: 'Date and duration are required' });
    }

    // Get all bookings for that date
    const bookingsRef = db.collection('bookings');
    const dayBookings = await bookingsRef
      .where('date', '==', date)
      .where('status', 'in', ['pending', 'approved'])
      .get();

    const existingBookings = [];
    dayBookings.forEach(doc => {
      const booking = doc.data();
      if (!auditoriumId || booking.auditoriumId === auditoriumId) {
        existingBookings.push(booking);
      }
    });

    // Find available time slots
    const availableSlots = findAvailableSlots(existingBookings, duration);

    // Get user's preferred times
    const userBookings = await bookingsRef
      .where('userId', '==', userId)
      .where('status', '==', 'approved')
      .get();

    const preferredTimes = [];
    userBookings.forEach(doc => {
      preferredTimes.push(doc.data().startTime);
    });

    // Rank slots by user preference
    const rankedSlots = rankSlotsByPreference(availableSlots, preferredTimes);

    res.json({
      optimalSlot: rankedSlots[0] || null,
      availableSlots: rankedSlots,
      message: rankedSlots.length > 0 
        ? `Found ${rankedSlots.length} available time slot(s)` 
        : 'No available slots for the selected date'
    });
  } catch (error) {
    console.error('Error finding optimal time:', error);
    res.status(500).json({ message: 'Failed to find optimal time', error: error.message });
  }
}

// Helper functions

function analyzeBookingPatterns(bookings) {
  const patterns = {
    favoriteAuditorium: null,
    favoriteEventType: null,
    preferredDays: [],
    preferredTimeSlots: [],
    averageDuration: 0,
    totalBookings: bookings.length
  };

  // Find favorite auditorium
  const auditoriumCounts = {};
  bookings.forEach(b => {
    auditoriumCounts[b.auditoriumId] = (auditoriumCounts[b.auditoriumId] || 0) + 1;
  });
  patterns.favoriteAuditorium = Object.keys(auditoriumCounts).reduce((a, b) => 
    auditoriumCounts[a] > auditoriumCounts[b] ? a : b, null
  );

  // Find favorite event type
  const eventTypeCounts = {};
  bookings.forEach(b => {
    eventTypeCounts[b.eventType] = (eventTypeCounts[b.eventType] || 0) + 1;
  });
  patterns.favoriteEventType = Object.keys(eventTypeCounts).reduce((a, b) => 
    eventTypeCounts[a] > eventTypeCounts[b] ? a : b, null
  );

  // Find preferred days (day of week)
  const dayCounts = {};
  bookings.forEach(b => {
    const day = new Date(b.date).getDay();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  patterns.preferredDays = Object.entries(dayCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([day]) => getDayName(parseInt(day)));

  // Find preferred time slots
  const timeCounts = {};
  bookings.forEach(b => {
    const hour = parseInt(b.startTime.split(':')[0]);
    const timeSlot = getTimeSlot(hour);
    timeCounts[timeSlot] = (timeCounts[timeSlot] || 0) + 1;
  });
  patterns.preferredTimeSlots = Object.entries(timeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([slot]) => slot);

  // Calculate average duration
  const durations = bookings.map(b => {
    const start = parseTime(b.startTime);
    const end = parseTime(b.endTime);
    return end - start;
  });
  patterns.averageDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);

  return patterns;
}

async function generateSuggestions(patterns, userId) {
  const suggestions = [];

  // Suggestion 1: Book your favorite auditorium
  if (patterns.favoriteAuditorium) {
    suggestions.push({
      type: 'auditorium',
      title: 'Your Favorite Venue',
      description: `You frequently book ${getAuditoriumName(patterns.favoriteAuditorium)}. Book it again for your next event.`,
      auditoriumId: patterns.favoriteAuditorium,
      priority: 'high'
    });
  }

  // Suggestion 2: Preferred time slot
  if (patterns.preferredTimeSlots.length > 0) {
    suggestions.push({
      type: 'time',
      title: 'Your Preferred Time',
      description: `You usually book during ${patterns.preferredTimeSlots[0]}. Consider this time for maximum convenience.`,
      timeSlot: patterns.preferredTimeSlots[0],
      priority: 'medium'
    });
  }

  // Suggestion 3: Preferred days
  if (patterns.preferredDays.length > 0) {
    suggestions.push({
      type: 'day',
      title: 'Your Preferred Days',
      description: `You typically book on ${patterns.preferredDays.join(', ')}. These days might work best for you.`,
      days: patterns.preferredDays,
      priority: 'medium'
    });
  }

  // Suggestion 4: Similar event type
  if (patterns.favoriteEventType) {
    suggestions.push({
      type: 'eventType',
      title: 'Similar Events',
      description: `Based on your history of ${patterns.favoriteEventType} events, we recommend similar venues and times.`,
      eventType: patterns.favoriteEventType,
      priority: 'low'
    });
  }

  return suggestions;
}

function findAvailableSlots(existingBookings, durationHours) {
  const slots = [];
  const workingHours = [
    { start: '09:00', end: '12:00' },
    { start: '13:00', end: '17:00' },
    { start: '18:00', end: '21:00' }
  ];

  workingHours.forEach(period => {
    const startTime = parseTime(period.start);
    const endTime = parseTime(period.end);

    for (let time = startTime; time + durationHours <= endTime; time += 0.5) {
      const slotStart = formatTime(time);
      const slotEnd = formatTime(time + durationHours);

      // Check if slot conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => {
        const bookingStart = parseTime(booking.startTime);
        const bookingEnd = parseTime(booking.endTime);
        return (time < bookingEnd && time + durationHours > bookingStart);
      });

      if (!hasConflict) {
        slots.push({ startTime: slotStart, endTime: slotEnd });
      }
    }
  });

  return slots;
}

function rankSlotsByPreference(slots, preferredTimes) {
  return slots.sort((a, b) => {
    const aScore = preferredTimes.filter(t => t === a.startTime).length;
    const bScore = preferredTimes.filter(t => t === b.startTime).length;
    return bScore - aScore;
  });
}

// Utility functions
function getDayName(dayNum) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNum];
}

function getTimeSlot(hour) {
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

function getAuditoriumName(id) {
  const auditoriums = {
    'aud1': 'Main Auditorium',
    'aud2': 'Seminar Hall A',
    'aud3': 'Seminar Hall B',
    'aud4': 'Conference Room'
  };
  return auditoriums[id] || id;
}

function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + minutes / 60;
}

function formatTime(decimalTime) {
  const hours = Math.floor(decimalTime);
  const minutes = Math.round((decimalTime - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

module.exports = {
  getSuggestions,
  findOptimalTime
};

/**
 * FIXED checkAvailability function for SmartAssistant.jsx
 * Replace lines 316-353 with this code
 */

  // Check availability with backend
async function checkSlotAvailability(req, res) {
  try {
    const { auditoriumId, date, startTime, endTime } = req.query;

    // Log the request for debugging
    console.log('===== Availability Check Request =====');
    console.log('Params received:', { auditoriumId, date, startTime, endTime });
    console.log('User:', req.user?.uid, req.user?.email);

    // Validate all required parameters
    const missingParams = [];
    if (!auditoriumId) missingParams.push('auditoriumId');
    if (!date) missingParams.push('date');
    if (!startTime) missingParams.push('startTime');
    if (!endTime) missingParams.push('endTime');

    if (missingParams.length > 0) {
      console.error('Missing required parameters:', missingParams);
      return res.status(400).json({ 
        message: `Missing required parameters: ${missingParams.join(', ')}`,
        received: { auditoriumId, date, startTime, endTime }
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      console.error('Invalid date format:', date);
      return res.status(400).json({ 
        message: 'Invalid date format. Expected YYYY-MM-DD',
        received: date
      });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      console.error('Invalid time format:', { startTime, endTime });
      return res.status(400).json({ 
        message: 'Invalid time format. Expected HH:MM (24-hour format)',
        received: { startTime, endTime }
      });
    }

    const availability = await checkAvailability(auditoriumId, date, startTime, endTime);

    console.log('Availability result:', availability);

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

      console.log(`Found ${availability.conflicts.length} conflicts`);

      res.json({
        available: false,
        conflicts: availability.conflicts,
        alternatives,
        message: `Time slot unavailable. ${availability.conflicts.length} conflicting booking(s) found.`
      });
    }
  } catch (error) {
    console.error('===== Check availability error =====');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error while checking availability',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
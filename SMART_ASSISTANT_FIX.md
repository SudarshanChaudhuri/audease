# Smart Assistant Availability Check Fix

## Issue
The availability check is failing with 400 Bad Request because:
1. Missing validation before API call
2. Poor error handling
3. No user-friendly toast notifications

## Fix Required in `frontend/src/components/SmartAssistant.jsx`

Replace the `checkAvailability` function (around line 317-353) with:

```javascript
  // Check availability with backend
  const checkAvailability = async () => {
    addBotMessage("🔍 Checking availability...", STEPS.CHECK_AVAILABILITY);
    
    try {
      const { auditoriumId, date, startTime, endTime } = bookingData;
      
      // Validate all required fields
      if (!auditoriumId || !date || !startTime || !endTime) {
        console.error('Missing booking data:', { auditoriumId, date, startTime, endTime });
        toast.error('Missing required booking information');
        addBotMessage("⚠️ Something went wrong. Let me start over with the booking details.", null);
        setTimeout(() => {
          restartConversation();
        }, 1500);
        return;
      }

      const response = await api.get('/bookings/checkAvailability', {
        params: { 
          auditoriumId, 
          date, 
          startTime, 
          endTime 
        }
      });

      setTimeout(() => {
        if (response.data.available) {
          toast.success('Time slot is available!');
          addBotMessage("✅ Perfect! The auditorium is available during that time.", null);
          setTimeout(() => {
            showSummary();
          }, 800);
        } else {
          const conflicts = response.data.conflicts || [];
          const conflictMsg = conflicts.length > 0 
            ? ` The slot conflicts with: ${conflicts.map(c => `${c.startTime}-${c.endTime}`).join(', ')}` 
            : '';
          
          toast.warning('Time slot unavailable');
          addBotMessage(
            `⚠️ Sorry, that time slot is already booked.${conflictMsg} Please choose a different time.`,
            STEPS.TIME
          );
          // Reset times and ask again
          setBookingData(prev => ({ ...prev, startTime: '', endTime: '' }));
          setTimeout(() => {
            addBotMessage("What time should the event start? (HH:MM format)", STEPS.TIME);
            setAwaitingInput(true);
          }, 1000);
        }
      }, 1000);
    } catch (error) {
      console.error('Availability check error:', error);
      const errorMsg = error.response?.data?.message || 'Could not verify availability';
      
      toast.error(errorMsg);
      addBotMessage(
        "⚠️ I couldn't verify the availability. This might be due to missing information. Let's start over.",
        null
      );
      setTimeout(() => {
        restartConversation();
      }, 2000);
    }
  };
```

## Additional Backend Validation

Ensure backend logging is added in `backend/src/controllers/bookingController.js`:

```javascript
async function checkSlotAvailability(req, res) {
  try {
    const { auditoriumId, date, startTime, endTime } = req.query;

    console.log('Availability check request:', { auditoriumId, date, startTime, endTime });

    if (!auditoriumId || !date || !startTime || !endTime) {
      console.error('Missing parameters in availability check');
      return res.status(400).json({ 
        message: 'Missing required parameters',
        received: { auditoriumId, date, startTime, endTime }
      });
    }

    const availability = await checkAvailability(auditoriumId, date, startTime, endTime);

    if (availability.available) {
      res.json({
        available: true,
        message: 'Time slot is available'
      });
    } else {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
```

## Testing Steps

1. Rebuild frontend: `cd frontend && npm run build`
2. Deploy: `firebase deploy --only hosting`
3. Test booking flow:
   - Open Smart Assistant
   - Complete all booking details
   - Verify availability check shows toast notifications
   - Check console for detailed logs
   - Ensure proper error handling with friendly messages

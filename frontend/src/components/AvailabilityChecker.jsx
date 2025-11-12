import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { bookings } from '../lib/mockData';
import BookingForm from './BookingForm';
import '@fullcalendar/daygrid/main.css';

export default function AvailabilityChecker({ auditoriumId, onBookingCreated }) {
  const [selectedAuditorium, setSelectedAuditorium] = useState(auditoriumId || 'aud1');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const auditoriums = [
    { id: 'aud1', name: 'Main Auditorium', capacity: 500 },
    { id: 'aud2', name: 'Seminar Hall A', capacity: 150 },
    { id: 'aud3', name: 'Seminar Hall B', capacity: 100 },
    { id: 'aud4', name: 'Conference Room', capacity: 50 },
  ];

  // Convert bookings to calendar events
  const events = bookings
    .filter(booking => booking.auditoriumId === selectedAuditorium)
    .map(booking => ({
      id: booking.id,
      title: booking.title,
      start: `${booking.date}T${booking.startTime}`,
      end: `${booking.date}T${booking.endTime}`,
      backgroundColor: 
        booking.status === 'approved' ? '#10b981' : 
        booking.status === 'pending' ? '#f59e0b' : 
        '#ef4444',
      borderColor: 'transparent',
      extendedProps: {
        ...booking
      }
    }));

  const handleDateClick = (arg) => {
    setSelectedSlot({
      date: arg.date,
      auditoriumId: selectedAuditorium
    });
    setShowBookingForm(true);
  };

  const handleEventClick = (info) => {
    const booking = info.event.extendedProps;
    // Show booking details
    alert(`Event: ${booking.title}\nTime: ${booking.startTime} - ${booking.endTime}\nStatus: ${booking.status}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Auditorium Availability
          </h2>
          <p className="text-gray-400 mt-1">Check availability and book time slots</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowBookingForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Booking
        </motion.button>
      </div>

      {/* Auditorium Selector */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20">
        <label className="block text-sm font-medium text-gray-300 mb-3">Select Auditorium</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {auditoriums.map(aud => (
            <motion.button
              key={aud.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAuditorium(aud.id)}
              className={`p-4 rounded-lg transition-all ${
                selectedAuditorium === aud.id
                  ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                  : 'bg-gray-800/50 border-2 border-gray-700 text-gray-300 hover:border-green-500/50'
              }`}
            >
              <div className="font-semibold">{aud.name}</div>
              <div className="text-xs mt-1 opacity-70">Cap: {aud.capacity}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20">
        <div className="calendar-container">
          <style>{`
            .calendar-container .fc {
              background: transparent;
              color: #fff;
            }
            .calendar-container .fc-theme-standard td,
            .calendar-container .fc-theme-standard th {
              border-color: rgba(34, 197, 94, 0.1);
            }
            .calendar-container .fc-col-header-cell {
              background: rgba(0, 0, 0, 0.3);
              color: #10b981;
              font-weight: 600;
              padding: 12px 0;
            }
            .calendar-container .fc-daygrid-day {
              background: rgba(0, 0, 0, 0.2);
              transition: all 0.2s;
            }
            .calendar-container .fc-daygrid-day:hover {
              background: rgba(16, 185, 129, 0.1);
              cursor: pointer;
            }
            .calendar-container .fc-daygrid-day-number {
              color: #d1d5db;
              padding: 8px;
            }
            .calendar-container .fc-day-today {
              background: rgba(16, 185, 129, 0.15) !important;
            }
            .calendar-container .fc-day-today .fc-daygrid-day-number {
              color: #10b981;
              font-weight: bold;
            }
            .calendar-container .fc-event {
              border-radius: 6px;
              padding: 4px 8px;
              margin: 2px 0;
              font-size: 0.875rem;
              cursor: pointer;
              transition: all 0.2s;
            }
            .calendar-container .fc-event:hover {
              transform: scale(1.02);
              opacity: 0.9;
            }
            .calendar-container .fc-button {
              background: rgba(16, 185, 129, 0.2);
              border: 1px solid rgba(16, 185, 129, 0.3);
              color: #10b981;
              text-transform: capitalize;
              font-weight: 600;
            }
            .calendar-container .fc-button:hover {
              background: rgba(16, 185, 129, 0.3);
            }
            .calendar-container .fc-button-active {
              background: rgba(16, 185, 129, 0.4) !important;
            }
            .calendar-container .fc-toolbar-title {
              color: #10b981;
              font-size: 1.5rem;
              font-weight: 700;
            }
          `}</style>
          
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-gray-300">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-gray-300">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-gray-300">Rejected</span>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          onClose={() => {
            setShowBookingForm(false);
            setSelectedSlot(null);
          }}
          onSuccess={() => {
            onBookingCreated?.();
            setShowBookingForm(false);
            setSelectedSlot(null);
          }}
          initialData={selectedSlot}
        />
      )}
    </div>
  );
}

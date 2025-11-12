import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { format, isAfter, subHours } from 'date-fns';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';
import api from '../lib/api';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const response = await api.get(`/bookings/user/${user.uid}`);
      setBookings(response.data.bookings || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, bookingDate, bookingStartTime) => {
    // Check if booking is > 24 hours away
    const bookingDateTime = new Date(`${bookingDate}T${bookingStartTime}`);
    const minCancelTime = subHours(bookingDateTime, 24);
    
    if (!isAfter(minCancelTime, new Date())) {
      toast.error('Cannot cancel booking less than 24 hours before event');
      return;
    }

    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.post(`/bookings/cancel/${bookingId}`);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'rejected': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'cancelled': return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const today = new Date();
    const bookingDate = new Date(booking.date);
    
    // Apply status/time filters
    let passesFilter = true;
    if (filter === 'upcoming') {
      passesFilter = isAfter(bookingDate, today) && booking.status !== 'cancelled';
    } else if (filter === 'past') {
      passesFilter = !isAfter(bookingDate, today);
    } else if (filter !== 'all') {
      passesFilter = booking.status === filter;
    }

    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      booking.eventTitle?.toLowerCase().includes(searchLower) ||
      booking.auditoriumName?.toLowerCase().includes(searchLower) ||
      booking.eventType?.toLowerCase().includes(searchLower);

    return passesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          My Bookings
        </h2>
        <p className="text-gray-400 mt-1">View and manage your booking history</p>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'past', label: 'Past' },
            ].map(({ value, label }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === value
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-12 rounded-2xl border border-green-500/20 text-center">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400 text-lg">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20 hover:border-green-500/40 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">{booking.eventTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm">{booking.auditoriumName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm">{booking.audienceSize} attendees</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedBooking(booking)}
                      className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </motion.button>

                    {booking.status === 'pending' || booking.status === 'approved' ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancelBooking(booking.id, booking.date, booking.startTime)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </motion.button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl p-8 rounded-2xl border border-green-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">{selectedBooking.eventTitle}</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <p className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status?.toUpperCase()}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Event Type</label>
                  <p className="mt-1 text-white">{selectedBooking.eventType}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Date</label>
                    <p className="mt-1 text-white">{format(new Date(selectedBooking.date), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Time</label>
                    <p className="mt-1 text-white">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Auditorium</label>
                  <p className="mt-1 text-white">{selectedBooking.auditoriumName}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Expected Audience</label>
                  <p className="mt-1 text-white">{selectedBooking.audienceSize} people</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  <p className="mt-1 text-gray-300">{selectedBooking.description}</p>
                </div>

                {selectedBooking.seatingLayout && (
                  <div>
                    <label className="text-sm text-gray-400">Seating Layout</label>
                    <p className="mt-1 text-white">{selectedBooking.seatingLayout}</p>
                  </div>
                )}

                {selectedBooking.avRequirements && selectedBooking.avRequirements.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-400">AV Requirements</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedBooking.avRequirements.map((req, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBooking.rejectionReason && (
                  <div>
                    <label className="text-sm text-gray-400">Rejection Reason</label>
                    <p className="mt-1 text-red-400">{selectedBooking.rejectionReason}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

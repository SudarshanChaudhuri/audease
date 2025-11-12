import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // all, pending, approved, rejected
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const snapshot = await getDocs(bookingsRef);
      
      const fetchedBookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by date
      fetchedBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBookings(fetchedBookings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
      setLoading(false);
    }
  };

  const handleApprove = async (booking) => {
  if (!confirm(`Approve booking for "${booking.eventTitle || booking.title}"?`)) return;

    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      await updateDoc(bookingRef, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
      });

      // Create notification for user (only if userId exists)
      if (booking.userId || booking.createdBy) {
        await addDoc(collection(db, 'notifications'), {
          uid: booking.userId || booking.createdBy,
          type: 'success',
          title: 'Booking Approved',
    message: `Your booking for "${booking.eventTitle || booking.title}" on ${format(new Date(booking.date), 'MMM dd, yyyy')} has been approved!`,
          createdAt: new Date(),
          read: false,
        });
      }

      toast.success('Booking approved');
      fetchBookings();
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Failed to approve booking');
    }
  };

  const handleReject = async (booking) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      await updateDoc(bookingRef, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason,
      });

      // Create notification for user (only if userId exists)
      if (booking.userId || booking.createdBy) {
        await addDoc(collection(db, 'notifications'), {
          uid: booking.userId || booking.createdBy,
          type: 'error',
          title: 'Booking Rejected',
    message: `Your booking for "${booking.eventTitle || booking.title}" has been rejected. Reason: ${rejectionReason}`,
          createdAt: new Date(),
          read: false,
        });
      }

      toast.success('Booking rejected');
      setSelectedBooking(null);
      setRejectionReason('');
      fetchBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking');
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
    if (filter === 'all') return true;
    return booking.status === filter;
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
          All Bookings
        </h2>
        <p className="text-gray-400 mt-1">Manage and approve booking requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: bookings.length, color: 'blue' },
          { label: 'Pending', count: bookings.filter(b => b.status === 'pending').length, color: 'yellow' },
          { label: 'Approved', count: bookings.filter(b => b.status === 'approved').length, color: 'green' },
          { label: 'Rejected', count: bookings.filter(b => b.status === 'rejected').length, color: 'red' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-4 rounded-xl border border-green-500/20"
          >
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-400 mt-1`}>{stat.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-4 rounded-2xl border border-green-500/20">
        <div className="flex gap-2">
          {[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'all', label: 'All' },
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

      {/* Bookings Table */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-green-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Event Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Auditorium</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Requested By</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <AnimatePresence>
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{booking.eventTitle || booking.title}</div>
                      <div className="text-gray-400 text-sm">{booking.eventType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{format(new Date(booking.date), 'MMM dd, yyyy')}</div>
                      <div className="text-gray-400 text-sm">{booking.startTime} - {booking.endTime}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{booking.auditoriumName}</td>
                    <td className="px-6 py-4">
                      <div className="text-white">{booking.userName}</div>
                      <div className="text-gray-400 text-sm">{booking.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApprove(booking)}
                              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-all"
                            >
                              Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedBooking(booking)}
                              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-all"
                            >
                              Reject
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedBooking(booking)}
                          className="px-3 py-1 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-all"
                        >
                          View
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No bookings found
          </div>
        )}
      </div>

      {/* Booking Details/Rejection Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setSelectedBooking(null);
              setRejectionReason('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl p-8 rounded-2xl border border-green-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">{selectedBooking.eventTitle || selectedBooking.title}</h3>
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setRejectionReason('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-sm text-gray-400">Requested By</label>
                  <p className="mt-1 text-white">{selectedBooking.userName} ({selectedBooking.userEmail})</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  <p className="mt-1 text-gray-300">{selectedBooking.description}</p>
                </div>

                {selectedBooking.status === 'pending' && (
                  <div className="pt-4 border-t border-gray-700">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors resize-none"
                      placeholder="Provide a reason for rejection..."
                    />
                  </div>
                )}
              </div>

              {selectedBooking.status === 'pending' && (
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleApprove(selectedBooking)}
                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Approve Booking
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReject(selectedBooking)}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Reject Booking
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

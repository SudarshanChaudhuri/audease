import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import BookingForm from '../components/BookingForm'
import BookingHistory from '../components/BookingHistory'
import SmartAssistant from '../components/SmartAssistant'
import Notifications from '../components/Notifications'
import Analytics from '../components/Analytics'
import { stats, auditoriums } from '../lib/mockData'
import { auth } from '../config/firebase'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const engineeringDepartments = [
  'Computer Science and Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics and Communication Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Biomedical Engineering',
  'Industrial Engineering',
  'Information Technology'
]

function MetricCard({ title, value, icon }) {
  return (
    <div className="p-4 rounded-2xl bg-black/60 border border-green-900 shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-sm text-green-300">{title}</div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-green-100">{value}</div>
    </div>
  )
}

export default function StudentDashboard() {
  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentView, setCurrentView] = useState('dashboard')
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [userDepartment, setUserDepartment] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email || '')
        setUserName(user.displayName || '')
      }
    })
    return () => unsubscribe()
  }, [])

  const handleBookingSuccess = () => {
    setShowModal(false)
    // Trigger refresh of booking history
    setRefreshKey(prev => prev + 1)
  }

  const handleNavigation = (viewId) => {
    setCurrentView(viewId)
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">Student Dashboard</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-black font-bold shadow-md">New Booking Request</button>
              </div>
            </div>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <MetricCard title="Total Bookings" value={stats.totalBookings} icon="📊" />
              <MetricCard title="Upcoming Events" value={stats.upcomingBookings} icon="📅" />
              <MetricCard title="Pending Approval" value={stats.pendingApprovals} icon="⏳" />
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }} className="grid grid-cols-1 gap-6">
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">My Recent Bookings</h3>
                <BookingHistory key={refreshKey} />
              </div>
            </motion.section>
          </>
        )

      case 'bookings':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">My Bookings</h2>
              <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-black font-bold shadow-md">New Booking Request</button>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">All My Bookings</h3>
                <BookingHistory key={refreshKey} />
              </div>
            </motion.section>
          </>
        )

      case 'requests':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">Notifications & Requests</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">Recent Notifications</h3>
                <Notifications />
              </div>
            </motion.section>
          </>
        )

      case 'users':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">Available Auditoriums</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {auditoriums.map(aud => (
                  <div key={aud.id} className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl hover:border-green-500 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-green-100">{aud.name}</h3>
                      <span className="text-3xl">🏛️</span>
                    </div>
                    <div className="space-y-2 text-green-300">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👥</span>
                        <span>Capacity: <strong className="text-green-100">{aud.capacity}</strong> people</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📍</span>
                        <span>{aud.location}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowModal(true)} 
                      className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white font-medium hover:from-green-700 hover:to-emerald-800 transition-all"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>
          </>
        )

      case 'analytics':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">My Booking Analytics</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">Statistics & Insights</h3>
                <Analytics />
              </div>
            </motion.section>
          </>
        )

      case 'settings':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">Settings</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-green-300 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your full name" 
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-green-300 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={userEmail} 
                      disabled
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed" 
                    />
                    <p className="text-xs text-green-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-green-300 mb-2">Department</label>
                    <select 
                      value={userDepartment} 
                      onChange={(e) => setUserDepartment(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    >
                      <option value="">Select Department</option>
                      {engineeringDepartments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-green-300 mb-2">Notification Preferences</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-green-200">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Email notifications for booking updates
                      </label>
                      <label className="flex items-center gap-2 text-green-200">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Reminders for upcoming events
                      </label>
                      <label className="flex items-center gap-2 text-green-200">
                        <input type="checkbox" className="rounded" />
                        Weekly booking summary
                      </label>
                    </div>
                  </div>
                  <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-black font-bold hover:from-green-500 hover:to-green-600 transition-all">Save Changes</button>
                </div>
              </div>
            </motion.section>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-100 font-manrope">
      <div className="flex">
        <Sidebar compact onNavigate={handleNavigation} />

        <div className="flex-1 p-6">
          {renderContent()}

          {/* Booking Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="absolute inset-0 bg-black/80" onClick={() => setShowModal(false)} />
              <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <BookingForm onSuccess={handleBookingSuccess} onClose={() => setShowModal(false)} />
              </div>
            </div>
          )}
      
          {/* Smart Assistant - Floating Chat Button */}
          <SmartAssistant />
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { bookings as mockBookings, stats, users } from '../lib/mockData'
import SmartAssistant from '../components/SmartAssistant'
import BookingHistory from '../components/BookingHistory'
import Notifications from '../components/Notifications'
import Analytics from '../components/Analytics'
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

function MetricCard({ title, value }) {
  return (
    <div className="p-4 rounded-2xl bg-black/60 border border-green-900 shadow-md">
      <div className="text-sm text-green-300">{title}</div>
      <div className="text-2xl font-bold text-green-100">{value}</div>
    </div>
  )
}

export default function FacultyDashboard() {
  const [department, setDepartment] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
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

  const departments = ['All', 'Computer Science', 'Drama', 'Music', 'Physics']

  const filtered = mockBookings.filter(b => (department === 'All' || b.requester?.includes(department)) && (dateFilter ? b.date === dateFilter : true))

  const handleNavigation = (viewId) => {
    setCurrentView(viewId)
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">Faculty Dashboard</h2>
              <div className="flex items-center gap-3">
                <select value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-black/50 border border-green-900 text-green-200 px-3 py-2 rounded-lg">
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-black/50 border border-green-900 text-green-200 px-3 py-2 rounded-lg" />
              </div>
            </div>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <MetricCard title="Total bookings (this sem)" value={stats.totalThisSemester} />
              <MetricCard title="Approved" value={stats.approved} />
              <MetricCard title="Pending" value={stats.pending} />
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.35 }} className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
              <h3 className="text-2xl font-bold text-green-100 mb-4">Team Booking Requests</h3>
              <div className="space-y-3">
                {filtered.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <div>
                      <div className="font-semibold">{b.event || b.title}</div>
                      <div className="text-sm text-green-300">{b.date} • {b.startTime} • {b.auditoriumName}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-green-200">{b.requester || b.userName}</div>
                      <div className="text-sm"><span className={`px-3 py-1 rounded-full ${b.status === 'approved' ? 'bg-green-600 text-black' : b.status === 'pending' ? 'bg-yellow-500 text-black' : 'bg-red-600 text-white'}`}>{b.status}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </>
        )

      case 'bookings':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">All Department Bookings</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">Booking History</h3>
                <BookingHistory />
              </div>
            </motion.section>
          </>
        )

      case 'requests':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">Pending Requests</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">Pending Approvals</h3>
                <div className="space-y-3">
                  {mockBookings.filter(b => b.status === 'pending').map(b => (
                    <div key={b.id} className="p-4 bg-black/40 rounded-lg border border-yellow-500/30">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-lg">{b.title}</div>
                          <div className="text-sm text-green-300">{b.userName} • {b.userEmail}</div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-sm font-medium">Pending</span>
                      </div>
                      <div className="text-sm text-green-300 mt-2">
                        <div>📅 {b.date} • {b.startTime} - {b.endTime}</div>
                        <div>🏛️ {b.auditoriumName} • 👥 {b.audienceSize} attendees</div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="px-4 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700">Approve</button>
                        <button className="px-4 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </>
        )

      case 'users':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">Department Members</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.filter(u => u.role !== 'admin').map(user => (
                  <div key={user.id} className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl hover:border-green-500 transition-colors">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-black font-bold text-xl">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-100">{user.name}</h3>
                        <span className="text-sm text-green-300 capitalize">{user.role}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-green-300">
                      <div className="flex items-center gap-2">
                        <span>📧</span>
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🏢</span>
                        <span className="text-sm">{user.department}</span>
                      </div>
                    </div>
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
              <h2 className="text-3xl font-extrabold">Department Analytics</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">Booking Statistics</h3>
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
                <h3 className="text-2xl font-bold text-green-100 mb-4">Faculty Settings</h3>
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
                    <label className="block text-green-300 mb-2">Role Permissions</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-green-200">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Can approve department bookings
                      </label>
                      <label className="flex items-center gap-2 text-green-200">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Receive approval notifications
                      </label>
                      <label className="flex items-center gap-2 text-green-200">
                        <input type="checkbox" className="rounded" />
                        Manage department users
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

          {/* Smart Assistant - Floating Chat Button */}
          <SmartAssistant />
        </div>
      </div>
    </div>
  )
}

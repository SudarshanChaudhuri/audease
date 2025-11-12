import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import AllBookings from '../components/AllBookings'
import Notifications from '../components/Notifications'
import Analytics from '../components/Analytics'
import { users, auditoriums, stats } from '../lib/mockData'
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

export default function AdminDashboard() {
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

  const handleNavigation = (viewId) => {
    setCurrentView(viewId)
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">Admin Dashboard</h2>
            </div>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <MetricCard title="Total Bookings" value={stats.totalBookings} icon="📊" />
              <MetricCard title="Pending Approvals" value={stats.pendingApprovals} icon="⏳" />
              <MetricCard title="Approved This Month" value={stats.approvedThisMonth} icon="✅" />
              <MetricCard title="Utilization Rate" value={`${stats.utilizationRate}%`} icon="📈" />
            </motion.section>

            {/* All Bookings Management */}
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-6">
              <AllBookings />
            </motion.section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notifications */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h4 className="text-xl font-bold text-green-100 mb-3">Recent Notifications</h4>
                <div className="max-h-96 overflow-y-auto">
                  <Notifications />
                </div>
              </motion.div>

              {/* Analytics Overview */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h4 className="text-xl font-bold text-green-100 mb-3">Analytics Overview</h4>
                <div className="max-h-96 overflow-y-auto">
                  <Analytics />
                </div>
              </motion.div>
            </div>
          </>
        )

      case 'bookings':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">All Bookings</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <AllBookings />
            </motion.section>
          </>
        )

      case 'requests':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">System Notifications</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">All Notifications</h3>
                <Notifications />
              </div>
            </motion.section>
          </>
        )

      case 'users':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">User Management</h2>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-black font-bold">+ Add User</button>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">All Users</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-green-900">
                        <th className="text-left py-3 px-4 text-green-300">Name</th>
                        <th className="text-left py-3 px-4 text-green-300">Email</th>
                        <th className="text-left py-3 px-4 text-green-300">Role</th>
                        <th className="text-left py-3 px-4 text-green-300">Department</th>
                        <th className="text-left py-3 px-4 text-green-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b border-green-900/30 hover:bg-black/40">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-black font-bold text-sm">
                                {user.name.charAt(0)}
                              </div>
                              {user.name}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-green-300">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-600 text-white' :
                              user.role === 'faculty' ? 'bg-blue-600 text-white' :
                              'bg-green-600 text-black'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-green-300">{user.department}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="text-blue-400 hover:text-blue-300">Edit</button>
                              <button className="text-red-400 hover:text-red-300">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>
          </>
        )

      case 'analytics':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">System Analytics</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                <h3 className="text-2xl font-bold text-green-100 mb-4">Comprehensive Analytics</h3>
                <Analytics />
              </div>
            </motion.section>
          </>
        )

      case 'settings':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold">System Settings</h2>
            </div>
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Admin Profile Settings */}
                <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                  <h3 className="text-2xl font-bold text-green-100 mb-4">Admin Profile</h3>
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
                        <option value="Administration">Administration</option>
                        {engineeringDepartments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-black font-bold hover:from-green-500 hover:to-green-600 transition-all">Save Profile</button>
                  </div>
                </div>

                {/* Auditorium Management */}
                <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                  <h3 className="text-2xl font-bold text-green-100 mb-4">Auditorium Management</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {auditoriums.map(aud => (
                      <div key={aud.id} className="p-4 bg-black/40 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold">{aud.name}</div>
                          <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                        </div>
                        <div className="text-sm text-green-300">
                          <div>Capacity: {aud.capacity}</div>
                          <div>{aud.location}</div>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-2 border border-green-500 rounded-lg text-green-400 hover:bg-green-500 hover:text-black transition-colors">
                      + Add Auditorium
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                  <h3 className="text-2xl font-bold text-green-100 mb-4">System Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-green-300 mb-2">Booking Approval Mode</label>
                      <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                        <option>Manual Approval Required</option>
                        <option>Auto-approve Faculty</option>
                        <option>Auto-approve All</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-green-300 mb-2">Booking Window (days ahead)</label>
                      <input type="number" defaultValue="90" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </div>
                    <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-black font-bold hover:from-green-500 hover:to-green-600 transition-all">Save Configuration</button>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="p-6 rounded-2xl bg-black/60 border border-green-900 shadow-xl">
                  <h3 className="text-2xl font-bold text-green-100 mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-green-300 mb-2">Enable Notifications</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-green-200">
                          <input type="checkbox" defaultChecked className="rounded" />
                          Email notifications
                        </label>
                        <label className="flex items-center gap-2 text-green-200">
                          <input type="checkbox" defaultChecked className="rounded" />
                          SMS notifications
                        </label>
                        <label className="flex items-center gap-2 text-green-200">
                          <input type="checkbox" className="rounded" />
                          Push notifications
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-green-300 mb-2">Notification Frequency</label>
                      <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                        <option>Instant</option>
                        <option>Daily Digest</option>
                        <option>Weekly Summary</option>
                      </select>
                    </div>
                    <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-black font-bold hover:from-green-500 hover:to-green-600 transition-all">Save Notifications</button>
                  </div>
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
        </div>
      </div>
    </div>
  )
}

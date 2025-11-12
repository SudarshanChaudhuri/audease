import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'
import { toast } from 'react-toastify'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'requests', label: 'Requests', icon: '✉️' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ className = '', compact = false, onNavigate }) {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email || 'No email')
      }
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  return (
    <motion.aside
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.28 }}
      className={`w-64 ${compact ? 'hidden md:block' : 'block'} bg-black/60 backdrop-blur-md border-r border-green-900 p-4 rounded-r-xl ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center text-black font-bold shadow-sm">A</div>
        <div>
          <div className="text-lg font-bold text-green-100">AudEase</div>
          <div className="text-xs text-green-300 -mt-1">Auditorium Booking</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((n) => (
          <button
            key={n.id}
            onClick={() => (onNavigate ? onNavigate(n.id) : navigate('/' + n.id))}
            className="flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-black/40 hover:translate-x-1 transform transition text-green-200"
          >
            <span className="text-xl">{n.icon}</span>
            <span className="font-medium">{n.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 border-t border-green-900 pt-4 space-y-3">
        <div className="text-sm text-green-300">
          <div className="flex flex-col gap-1">
            <div className="text-xs">Signed in as</div>
            <div className="font-medium text-green-100 text-xs break-all">{userEmail}</div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 hover:border-red-500 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </motion.aside>
  )
}

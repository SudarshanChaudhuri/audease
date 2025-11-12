import React, { useState } from 'react'
import AuthForm from '../components/AuthForm'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

export default function Auth({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)

  return (
    <div className="min-h-screen bg-black antialiased">
      <div className="relative">
        <img src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1950&q=80" alt="bg" className="w-full h-screen object-cover brightness-40 contrast-125" />
        <div className="absolute inset-0 bg-black/65"></div>

        <div className="absolute inset-0 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.995 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28 }} className="w-full max-w-2xl">

            {/* Central auth card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: informational panel */}
                <div className="hidden md:flex flex-col justify-center p-8 bg-black/70 text-green-100">
                  <h3 className="text-3xl font-extrabold mb-3">Create an account</h3>
                  <p className="text-sm text-green-200 mb-6 leading-relaxed">Register to access room bookings, approvals and institutional calendars.</p>

                  <div className="flex flex-wrap gap-3 items-center">
                    {[
                      { key: 'live', label: 'Live Availability', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )},
                      { key: 'smart', label: 'Smart Booking', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6l4 2" />
                          <circle cx="12" cy="12" r="10" strokeWidth={1.8} />
                        </svg>
                      )},
                      { key: 'approvals', label: 'Approvals', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        </svg>
                      )},
                      { key: 'notifications', label: 'Notifications', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
                        </svg>
                      )},
                      { key: 'analytics', label: 'Analytics', icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3v18M4 12h14" />
                        </svg>
                      )}
                    ].map((it) => (
                      <div key={it.key} className="flex items-center gap-2 bg-white/6 px-3 py-2 rounded-full text-sm text-green-100">
                        <span className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-xs font-bold text-black">
                          {it.icon}
                        </span>
                        <span className="whitespace-nowrap">{it.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: form panel */}
                <div className="p-6 md:p-10">
                  <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-green-900 mb-4">{mode === 'login' ? 'Login Form' : 'Signup Form'}</h2>

                    {/* Toggle pill */}
                    <div className="w-full max-w-sm rounded-full bg-white/90 border border-white/20 p-1 shadow-sm mb-6">
                      <div className="flex items-center rounded-full bg-transparent">
                        <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-full ${mode === 'login' ? 'bg-linear-to-r from-green-400 to-green-500 text-black shadow' : 'text-green-700'}`}>Login</button>
                        <button onClick={() => setMode('register')} className={`flex-1 py-2 rounded-full ${mode === 'register' ? 'bg-linear-to-r from-green-400 to-green-500 text-black shadow' : 'text-green-700'}`}>Signup</button>
                      </div>
                    </div>

                    {/* Form inserted without its own wrapper */}
                    <div className="w-full">
                      <AuthForm mode={mode} noWrapper />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

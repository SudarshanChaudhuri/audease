import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">
            About AudEase
          </h1>
          <p className="text-gray-400 text-lg">
            Simplifying auditorium booking for educational institutions
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            AudEase is designed to streamline the auditorium booking process for universities and educational institutions. 
            We eliminate the hassle of manual booking, reduce scheduling conflicts, and provide a transparent, efficient 
            platform for students, faculty, and administrators.
          </p>
        </div>

        {/* Features */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Real-time Availability</h3>
                <p className="text-gray-400 text-sm">Check auditorium availability instantly and avoid double bookings</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Smart Approval System</h3>
                <p className="text-gray-400 text-sm">Streamlined approval workflow for administrators</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Instant Notifications</h3>
                <p className="text-gray-400 text-sm">Get notified about booking status and updates</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Analytics Dashboard</h3>
                <p className="text-gray-400 text-sm">Track usage patterns and optimize resource allocation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team/Values */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our Values</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-green-400 font-semibold mb-2">Simplicity</h3>
              <p className="text-gray-300">We believe technology should make life easier, not more complicated. Our interface is intuitive and user-friendly.</p>
            </div>
            <div>
              <h3 className="text-green-400 font-semibold mb-2">Transparency</h3>
              <p className="text-gray-300">Clear visibility into booking status, availability, and approval processes for all users.</p>
            </div>
            <div>
              <h3 className="text-green-400 font-semibold mb-2">Efficiency</h3>
              <p className="text-gray-300">Save time and reduce administrative overhead with automated workflows and smart notifications.</p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Built With Modern Technology</h2>
          <p className="text-gray-300 mb-4">
            AudEase is built using cutting-edge technologies to ensure reliability, security, and performance:
          </p>
          <div className="flex flex-wrap gap-3">
            {['React', 'Firebase', 'Tailwind CSS', 'Vite', 'Framer Motion'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium border border-green-500/30"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl p-8 rounded-2xl border border-green-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-6">
            Join hundreds of institutions already using AudEase to manage their facilities.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Account
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white font-semibold rounded-lg border border-green-500/30 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

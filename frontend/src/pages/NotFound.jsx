import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            404
          </h1>
          <div className="mt-4 mb-8">
            <svg
              className="w-32 h-32 mx-auto text-green-500/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Go to Home
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white font-semibold rounded-lg border border-green-500/30 transition-all duration-200"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <p className="text-gray-500 mb-4">Or explore these pages:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/about" className="text-green-400 hover:text-green-300 transition-colors">
              About
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/contact" className="text-green-400 hover:text-green-300 transition-colors">
              Contact
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/login" className="text-green-400 hover:text-green-300 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

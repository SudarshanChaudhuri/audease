import React from 'react'

export default function AlertMessage({ type = 'info', message }) {
  if (!message) return null
  const bg = type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-800 border border-green-100'
  return (
    <div className={`px-4 py-2 rounded-md ${bg} shadow-sm`}>{message}</div>
  )
}

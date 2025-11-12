import React from 'react'

export default function RoleSelector({ value, onChange }) {
  return (
    <label className="block">
      <div className="text-sm text-green-900 mb-1">Role</div>
      <select value={value} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-white/95 border border-gray-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-200">
        <option value="Student">Student</option>
        <option value="Faculty">Faculty</option>
        <option value="Admin">Admin</option>
      </select>
    </label>
  )
}

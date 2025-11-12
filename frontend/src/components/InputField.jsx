import React from 'react'

export default function InputField({ label, id, name, type='text', value, onChange, placeholder, error }) {
  return (
    <label className="block">
      <div className="text-sm text-green-900 mb-1">{label}</div>
      <input id={id} name={name || id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg bg-white/95 border ${error ? 'border-red-500' : 'border-gray-200'} text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-200`} />
      {error && <div className="text-sm text-red-400 mt-1">{error}</div>}
    </label>
  )
}

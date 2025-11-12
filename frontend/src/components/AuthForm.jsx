import React, { useState } from 'react'
import InputField from './InputField'
import RoleSelector from './RoleSelector'
import AlertMessage from './AlertMessage'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function AuthForm({ mode = 'login', noWrapper = false }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Student', remember: false })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }) }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        // Firebase login
        await signInWithEmailAndPassword(auth, form.email, form.password)
        setSuccess('Login successful!')
        navigate('/dashboard')
      } else {
        // Firebase registration
        if (form.password !== form.confirm) throw new Error('Passwords do not match')
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
        const user = userCredential.user
        
        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: form.name,
          email: form.email,
          role: form.role,
          createdAt: new Date().toISOString(),
          status: 'active'
        })
        
        setSuccess('Account created successfully!')
        navigate('/dashboard')
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const formContents = (
    <form onSubmit={submit}>
      <h3 className="text-2xl font-bold mb-4 text-green-900 text-center">{mode === 'login' ? 'Sign In' : 'Create account'}</h3>
      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

      {mode === 'register' && (
        <InputField label="Name" id="name" value={form.name} onChange={(e) => onChange(e)} name="name" placeholder="Your full name" />
      )}

      <div className="mt-4">
        <InputField label="Email" id="email" value={form.email} onChange={(e) => onChange(e)} name="email" placeholder="you@university.edu" />
      </div>

      <div className="mt-4">
        <InputField label="Password" id="password" type="password" value={form.password} onChange={(e) => onChange(e)} name="password" placeholder="••••••" />
      </div>

      {mode === 'register' && (
        <div className="mt-4">
          <InputField label="Confirm Password" id="confirm" type="password" value={form.confirm} onChange={(e) => onChange(e)} name="confirm" placeholder="••••••" />
        </div>
      )}

      {mode === 'register' && (
        <div className="mt-4">
          <RoleSelector value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <label className="flex items-center gap-2 text-green-900">
          <input type="checkbox" name="remember" checked={form.remember} onChange={onChange} className="w-4 h-4" /> Remember me
        </label>
        <a className="text-sm text-green-600 hover:underline" href="#">Forgot password?</a>
      </div>

      <div className="mt-6">
        <button type="submit" disabled={loading} className="w-full px-4 py-2 rounded-lg bg-linear-to-r from-green-400 to-green-500 text-black font-bold">{mode === 'login' ? 'Login' : 'Create account'}</button>
      </div>
    </form>
  )

  if (noWrapper) return formContents

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 shadow-xl">
      {formContents}
    </div>
  )
}

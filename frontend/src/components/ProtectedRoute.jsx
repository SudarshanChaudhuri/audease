import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!mounted) return
      
      if (user) {
        setAuthorized(true)
      } else {
        setAuthorized(false)
        navigate('/login')
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!authorized) return null
  return children
}

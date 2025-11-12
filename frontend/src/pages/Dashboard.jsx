import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../config/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return
      
      if (!user) {
        // Not logged in, redirect to login
        navigate('/login')
        return
      }

      try {
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const role = userData.role?.toLowerCase()
          
          // Redirect based on role
          if (role === 'student') {
            navigate('/dashboard/student', { replace: true })
          } else if (role === 'faculty') {
            navigate('/dashboard/faculty', { replace: true })
          } else if (role === 'admin') {
            navigate('/dashboard/admin', { replace: true })
          } else {
            // Default to student if role is unknown
            navigate('/dashboard/student', { replace: true })
          }
        } else {
          // No user data in Firestore, redirect to login
          navigate('/login')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/login')
      } finally {
        if (mounted) setLoading(false)
      }
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
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return null
}

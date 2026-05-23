"use client"
import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "@/lib/firebase"

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>({})
  const [presence, setPresence] = useState<any>({})
  const [status, setStatus] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubAnalytics = onValue(ref(db, 'analytics'), (snap) => {
      setAnalytics(snap.val() || {})
    })
    
    const unsubPresence = onValue(ref(db, 'presence'), (snap) => {
      setPresence(snap.val() || {})
    })
    
    const unsubStatus = onValue(ref(db, 'status'), (snap) => {
      setStatus(snap.val() || {})
      setLoading(false)
    })

    return () => {
      unsubAnalytics()
      unsubPresence()
      unsubStatus()
    }
  }, [])

  const onlineCount = Object.values(presence).filter((u: any) => u.online).length
  const totalUsers = Object.keys(presence).length

return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-gray-800 rounded">
        <p className="text-gray-400">Online Users</p>
        <p className="text-2xl">{onlineCount}</p>
      </div>
      
      <div className="p-4 bg-gray-800 rounded">
        <p className="text-gray-400">Total Users</p>
        <p className="text-2xl">{totalUsers}</p>
      </div>
    </div>
  </div>
)
  </div>
)
}

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
    <div

"use client"

import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"
import { useEffect, useState } from "react"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          setProfile(profile)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
      } else if (session?.user) {
        setUser(session.user)
        await getUser()
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === "admin",
    isSeller: profile?.role === "seller",
    isCustomer: profile?.role === "customer",
  }
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from './supabaseClient'

export function useUser() {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setUser((data as any)?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  return { user, loading }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export function useRequireAuth(redirectTo = '/login') {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push(redirectTo)
  }, [user, loading, router, redirectTo])

  return { user, loading }
}

'use client'

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/client'
import { isSupabaseConfigured } from '@/lib/supabase-config'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  /** Sign in an already-registered user with email + password. */
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Single browser-side client instance to avoid duplicate GoTrue listeners.
  const supabase = useMemo<SupabaseClient | null>(() => {
    if (!isSupabaseConfigured()) {
      return null
    }

    return createClient()
  }, [])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) {
      return
    }

    let active = true

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setUser(data.user)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [supabase])

  const login = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        throw new Error('Supabase is not configured')
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    },
    [supabase]
  )

  const logout = useCallback(async () => {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
  }, [supabase])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

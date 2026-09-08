import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

const AuthContext = createContext({
  session: null,
  loading: true,
  signIn: async () => ({ error: 'Supabase is not configured.' }),
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured yet. See database/schema.sql and .env.example.' }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

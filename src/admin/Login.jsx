import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'
import styles from './admin.module.css'

export default function Login() {
  const { signIn, session } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error: signInError } = await signIn(email, password)
    setSubmitting(false)
    if (signInError) {
      setError(signInError)
      return
    }
    navigate('/admin')
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h1>AM INTERIOR ADMIN</h1>

        {!isSupabaseConfigured && (
          <div className={styles.configWarning}>
            Supabase isn't configured yet. Follow <strong>database/SETUP.md</strong> to create
            your project, run the schema, and add your <code>.env</code> file before logging in.
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button className={styles.btnPrimary} type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

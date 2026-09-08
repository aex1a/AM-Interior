import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import styles from './admin.module.css'

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, featured: 0, newMessages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ count: projectCount }, { count: featuredCount }, { count: newMsgCount }] =
        await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }).eq('featured', true),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        ])
      setStats({
        projects: projectCount || 0,
        featured: featuredCount || 0,
        newMessages: newMsgCount || 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Dashboard</h1>
      </div>

      <div className={styles.statCards}>
        <div className={styles.statCard}>
          <h3>{loading ? '…' : stats.projects}</h3>
          <p>Total Projects</p>
        </div>
        <div className={styles.statCard}>
          <h3>{loading ? '…' : stats.featured}</h3>
          <p>Featured Projects</p>
        </div>
        <div className={styles.statCard}>
          <h3>{loading ? '…' : stats.newMessages}</h3>
          <p>New Messages</p>
        </div>
      </div>

      <div className={styles.card}>
        <p>
          Manage your project portfolio and inquiries from here.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <Link to="/admin/projects" className={styles.btnPrimary} style={{ textDecoration: 'none' }}>
            Manage Projects
          </Link>
          <Link to="/admin/messages" className={styles.btnSecondary} style={{ textDecoration: 'none' }}>
            View Messages
          </Link>
        </div>
      </div>
    </div>
  )
}

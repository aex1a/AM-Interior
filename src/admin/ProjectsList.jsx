import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import styles from './admin.module.css'

export default function ProjectsList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
    if (fetchError) setError(fetchError.message)
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This also deletes its gallery images.`)) return
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', id)
    if (deleteError) {
      alert(deleteError.message)
      return
    }
    load()
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Projects</h1>
        <Link to="/admin/projects/new" className={styles.btnPrimary} style={{ textDecoration: 'none' }}>
          + Add Project
        </Link>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.card}>
        {loading ? (
          <p>Loading…</p>
        ) : projects.length === 0 ? (
          <p>No projects yet. Click "Add Project" to create your first one.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Location</th>
                <th>Status</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.cover_image ? (
                      <img src={p.cover_image} alt="" className={styles.thumb} />
                    ) : (
                      <div className={styles.thumb} />
                    )}
                  </td>
                  <td>{p.title}</td>
                  <td>{p.location}</td>
                  <td>
                    <span className={styles.badge}>{p.status}</span>
                  </td>
                  <td>
                    {p.featured && <span className={`${styles.badge} ${styles.badgeFeatured}`}>Featured</span>}
                  </td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/admin/projects/${p.id}`} className={styles.btnSecondary} style={{ textDecoration: 'none' }}>
                      Edit
                    </Link>
                    <button className={styles.btnDanger} onClick={() => handleDelete(p.id, p.title)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import styles from './admin.module.css'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const markAs = async (id, status) => {
    await supabase.from('messages').update({ status }).eq('id', id)
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return
    await supabase.from('messages').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Messages</h1>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : messages.length === 0 ? (
        <div className={styles.card}>
          <p>No inquiries yet.</p>
        </div>
      ) : (
        messages.map((m) => (
          <div className={styles.card} key={m.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <strong>
                  {m.first_name} {m.last_name}
                </strong>{' '}
                {m.status === 'new' && <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>}
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                  {m.email} {m.contact ? `· ${m.contact}` : ''} ·{' '}
                  {new Date(m.created_at).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {m.status !== 'read' && (
                  <button className={styles.btnSecondary} onClick={() => markAs(m.id, 'read')}>
                    Mark Read
                  </button>
                )}
                <button className={styles.btnDanger} onClick={() => remove(m.id)}>
                  Delete
                </button>
              </div>
            </div>
            <p style={{ marginTop: '0.75rem' }}>{m.message}</p>
          </div>
        ))
      )}
    </div>
  )
}

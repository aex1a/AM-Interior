import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import styles from './admin.module.css'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'archived', label: 'Archived' },
]

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

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

  const clearFilters = () => {
    setStatusFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false

      const created = new Date(m.created_at)

      if (dateFrom) {
        const from = new Date(dateFrom)
        from.setHours(0, 0, 0, 0)
        if (created < from) return false
      }

      if (dateTo) {
        const to = new Date(dateTo)
        to.setHours(23, 59, 59, 999)
        if (created > to) return false
      }

      return true
    })
  }, [messages, statusFilter, dateFrom, dateTo])

  const filtersActive = statusFilter !== 'all' || dateFrom || dateTo
  const unreadCount = messages.filter((m) => m.status === 'new').length

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Messages</h1>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>
          {unreadCount} unread · {messages.length} total
        </span>
      </div>

      <div className={styles.card} style={{ marginBottom: '1.25rem' }}>
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <label>Status</label>
            <div className={styles.filterPills}>
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.filterPill} ${statusFilter === opt.value ? styles.filterPillActive : ''}`}
                  onClick={() => setStatusFilter(opt.value)}
                >
                  {opt.label}
                  {opt.value === 'new' && unreadCount > 0 ? ` (${unreadCount})` : ''}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="dateFrom">From</label>
            <input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="dateTo">To</label>
            <input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {filtersActive && (
            <button type="button" className={styles.btnSecondary} onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : filteredMessages.length === 0 ? (
        <div className={styles.card}>
          <p>{messages.length === 0 ? 'No inquiries yet.' : 'No messages match these filters.'}</p>
        </div>
      ) : (
        filteredMessages.map((m) => (
          <div className={styles.card} key={m.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <strong>
                  {m.first_name} {m.last_name}
                </strong>{' '}
                {m.status === 'new' && <span className={`${styles.badge} ${styles.badgeNew}`}>Unread</span>}
                {m.status === 'archived' && <span className={styles.badge}>Archived</span>}
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
                {m.status === 'read' && (
                  <button className={styles.btnSecondary} onClick={() => markAs(m.id, 'new')}>
                    Mark Unread
                  </button>
                )}
                {m.status !== 'archived' ? (
                  <button className={styles.btnSecondary} onClick={() => markAs(m.id, 'archived')}>
                    Archive
                  </button>
                ) : (
                  <button className={styles.btnSecondary} onClick={() => markAs(m.id, 'new')}>
                    Unarchive
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

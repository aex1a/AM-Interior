import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import styles from './admin.module.css'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'archived', label: 'Archived' },
]

function StarIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#d9a441' : 'none'} stroke={filled ? '#d9a441' : '#999'} strokeWidth="1.6">
      <polygon points="12 2.5 15.09 8.86 22 9.86 17 14.73 18.18 21.6 12 18.35 5.82 21.6 7 14.73 2 9.86 8.91 8.86 12 2.5" />
    </svg>
  )
}

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [importantOnly, setImportantOnly] = useState(false)

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

  const toggleImportant = async (id, current) => {
    // Optimistic update so the star responds instantly.
    setMessages((msgs) => msgs.map((m) => (m.id === id ? { ...m, important: !current } : m)))
    const { error } = await supabase.from('messages').update({ important: !current }).eq('id', id)
    if (error) load() // revert to server truth if the update failed
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
    setImportantOnly(false)
  }

  const filteredMessages = useMemo(() => {
    return messages
      .filter((m) => {
        if (statusFilter !== 'all' && m.status !== statusFilter) return false
        if (importantOnly && !m.important) return false

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
      // Starred messages float to the top; otherwise keep newest-first order.
      .sort((a, b) => {
        if (a.important !== b.important) return a.important ? -1 : 1
        return new Date(b.created_at) - new Date(a.created_at)
      })
  }, [messages, statusFilter, dateFrom, dateTo, importantOnly])

  const filtersActive = statusFilter !== 'all' || dateFrom || dateTo || importantOnly
  const unreadCount = messages.filter((m) => m.status === 'new').length
  const importantCount = messages.filter((m) => m.important).length

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
            <label>Starred</label>
            <button
              type="button"
              className={`${styles.filterPill} ${styles.filterPillStar} ${importantOnly ? styles.filterPillActive : ''}`}
              onClick={() => setImportantOnly((v) => !v)}
            >
              <StarIcon filled={importantOnly} /> Important{importantCount > 0 ? ` (${importantCount})` : ''}
            </button>
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
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <button
                  type="button"
                  className={styles.starButton}
                  onClick={() => toggleImportant(m.id, m.important)}
                  aria-label={m.important ? 'Unmark as important' : 'Mark as important'}
                  title={m.important ? 'Unmark as important' : 'Mark as important'}
                >
                  <StarIcon filled={m.important} />
                </button>

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
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
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
            <p style={{ marginTop: '0.75rem', marginLeft: '2rem' }}>{m.message}</p>
          </div>
        ))
      )}
    </div>
  )
}

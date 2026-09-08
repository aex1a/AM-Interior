import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import styles from './admin.module.css'

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/messages', label: 'Messages' },
]

export default function AdminLayout() {
  const { signOut, session } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          AM INTERIOR
          <span>Admin</span>
        </div>

        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}

        <button className={styles.signOut} onClick={handleSignOut}>
          Sign out{session?.user?.email ? ` (${session.user.email})` : ''}
        </button>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

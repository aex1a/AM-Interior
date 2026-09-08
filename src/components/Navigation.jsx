import { Link } from 'react-router-dom'
import styles from './Navigation.module.css'
import { withBase } from '../utils/assetPath.js'


const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navigation({ variant = 'default' }) {
  const navClass =
    variant === 'gallery'
      ? `${styles.navigation} ${styles.galleryVariant}`
      : styles.navigation

  return (
    <header className={navClass}>
      <ul className={styles.navList}>
        {NAV_LINKS.map((link) => (
          <Link key={link.to} to={link.to}>
            <li>{link.label}</li>
          </Link>
        ))}
      </ul>
      <hr />

      <div className={styles.social}>
        <a href="https://www.instagram.com/merwin_yin/" target="_blank" rel="noreferrer">
          <img src={withBase("/assets/images/instagram.png")} alt="Instagram" />
        </a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
          <img src={withBase("/assets/images/linkedin.png")} alt="LinkedIn" />
        </a>
        <a href="https://www.facebook.com/angelinemerwin.cainglet.1" target="_blank" rel="noreferrer">
          <img src={withBase("/assets/images/facebook.png")} alt="Facebook" />
        </a>
      </div>

      <h1>ANGELINE MERWIN</h1>
      <h2>INTERIORS</h2>
    </header>
  )
}

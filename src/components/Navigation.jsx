import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from './Navigation.module.css'
import { withBase } from '../utils/assetPath.js'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

// Header starts compressing once you've scrolled past this many pixels.
const COMPACT_THRESHOLD = 80

export default function Navigation() {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    let ticking = false

    const evaluate = () => {
      setCompact(window.scrollY > COMPACT_THRESHOLD)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(evaluate)
        ticking = true
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${styles.navigation} ${compact ? styles.compact : ''}`}>
      {/* Compact wordmark: hidden/collapsed by default, fades and slides in
          once the big title below has folded away on scroll. */}
      <span className={styles.compactBrand} aria-hidden={!compact}>
        Angeline Merwin
      </span>

      <ul className={styles.navList}>
        {NAV_LINKS.map((link) => (
          <Link key={link.to} to={link.to}>
            <li>{link.label}</li>
          </Link>
        ))}
      </ul>

      <div className={styles.social}>
        <a href="https://www.instagram.com/merwin_yin/" target="_blank" rel="noreferrer">
          <img src={withBase('/assets/images/instagram.png')} alt="Instagram" />
        </a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
          <img src={withBase('/assets/images/linkedin.png')} alt="LinkedIn" />
        </a>
        <a href="https://www.facebook.com/angelinemerwin.cainglet.1" target="_blank" rel="noreferrer">
          <img src={withBase('/assets/images/facebook.png')} alt="Facebook" />
        </a>
      </div>

      {/* Big title block: folds away (max-height + opacity) as you scroll,
          rather than just shrinking in place. */}
      <div className={styles.brandBlock}>
        <hr />
        <h1>ANGELINE MERWIN</h1>
        <h2>INTERIORS</h2>
      </div>
    </header>
  )
}

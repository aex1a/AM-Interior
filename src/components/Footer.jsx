import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import { withBase } from '../utils/assetPath.js'


const DEFAULT_CREDITS = [
  { name: 'BUENAOBRA', href: 'https://www.facebook.com/r.kiveeele' },
  { name: 'CUNANAN', href: 'https://www.facebook.com/jheneil10' },
  { name: 'NOOL', href: 'https://www.facebook.com/alexia28nool/' },
  { name: 'PANGILINAN', href: 'https://www.facebook.com/katherine.grace.pangilinan.14' },
]

const DEFAULT_TERMS =
  'TERMS AND CONDITIONS\n\n1. All content is protected by copyright.\n2. Projects displayed are for portfolio purposes only.\n3. By using this site, you agree to our policies.\n\n(Click OK to close)'

export default function Footer({
  variant = 'default',
  credits = DEFAULT_CREDITS,
  termsText = DEFAULT_TERMS,
}) {
  const footerClass =
    variant === 'home' ? `${styles.footer} ${styles.homeVariant}` : styles.footer

  const handleShowTerms = () => {
    window.alert(termsText)
  }

  return (
    <div className={footerClass}>
      <div className={styles.footerMain}>
        <div className={`${styles.footerCol} ${styles.fLeft}`}>
          <span className={styles.connectText}>STAY CONNECTED</span>
          <div className={styles.connectLine}></div>
          <div className={styles.fSocial}>
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
        </div>

        <div className={`${styles.footerCol} ${styles.fCenter}`}>
          <img src={withBase("/assets/images/logo.png")} alt="logo" className={styles.fLogo} />
        </div>

        <div className={`${styles.footerCol} ${styles.fRight}`}>
          <ul>
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/gallery">GALLERY</Link></li>
            <li><Link to="/about">ABOUT</Link></li>
            <li><Link to="/contact">CONTACT</Link></li>
            <li className={styles.backTop}>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                BACK TO TOP &uarr;
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerLegal}>
        <div className={styles.legalContent}>
          <span>
            &copy;{' '}
            {credits.map((credit, i) => (
              <span key={credit.name}>
                <a href={credit.href} target="_blank" rel="noreferrer">{credit.name}</a>
                {i < credits.length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>
          <div className={styles.legalLinks}>
            <span onClick={handleShowTerms} style={{ cursor: 'pointer' }}>PRIVACY POLICY</span>
            <span onClick={handleShowTerms} style={{ cursor: 'pointer' }}>TERMS AND CONDITION</span>
          </div>
        </div>
      </div>
    </div>
  )
}

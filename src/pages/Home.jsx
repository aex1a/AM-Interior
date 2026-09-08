import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation.jsx'
import Footer from '../components/Footer.jsx'
import SEO, { SITE_URL } from '../components/SEO.jsx'
import { ongoingProjects } from '../data/projects.js'
import { useProjects } from '../hooks/useProjects.js'
import styles from './Home.module.css'
import { withBase } from '../utils/assetPath.js'

const LOCAL_BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'InteriorDesignFirm',
  name: 'AM Interior — Angeline Merwin Interiors',
  image: `${SITE_URL}/assets/images/logo.png`,
  url: SITE_URL,
  areaServed: 'Philippines',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tarlac',
    addressRegion: 'Central Luzon',
    addressCountry: 'PH',
  },
  sameAs: [
    'https://www.instagram.com/merwin_yin/',
    'https://www.facebook.com/angelinemerwin.cainglet.1',
  ],
}

export default function Home() {
  const { featuredProjects } = useProjects()

  return (
    <div className={styles.page}>
      <SEO
        title="AM Interior | Interior Design & Architecture in Tarlac"
        description="AM Interior by Angeline Merwin Cainglet designs elegant, tailor-made residential and commercial interiors across Tarlac, Metro Manila, and Cebu."
        path="/"
        jsonLd={LOCAL_BUSINESS_JSON_LD}
      />
      <Navigation />

      <span className={styles.caption}>
        <img src={withBase("/assets/images/blurcap.png")} alt="background" className={styles.cimg} />
        <p>
          My customized approach blends creativity and vision to create thoughtfully designed
          spaces that embody our clients personalities and lifestyles.
        </p>
      </span>

      <div className={styles.container}>
        <div className={styles.black}></div>

        <div className={styles.featured}>
          <div className={styles.fproj}>
            <p>FEATURED PROJECTS</p>
          </div>

          {featuredProjects.map((project) => (
            <div className={styles.pic} key={project.title + project.location}>
              <img src={project.image} alt={`${project.title} — ${project.location}`} />
              <div className={styles.details}>
                <h1>{project.title}</h1>
                <h3>{project.location}</h3>
                <button className={styles.btn}>
                  <Link to="/gallery">VIEW PROJECT</Link>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.container2}>
          <hr />
          <div className={styles.ongoing}>
            <h3 className={styles.sectionTitle}>ONGOING PROJECTS</h3>

            <div className={styles.ongoingRow}>
              {ongoingProjects.map((project) => (
                <div className={styles.projectItem} key={project.num}>
                  <span className={styles.projNum}>{project.num}</span>
                  <p className={styles.projDesc}>
                    {project.desc.map((line, i) => (
                      <span key={line}>
                        {line}
                        {i < project.desc.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

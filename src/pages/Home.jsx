import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation.jsx'
import Footer from '../components/Footer.jsx'
import { featuredProjects, ongoingProjects } from '../data/projects.js'
import styles from './Home.module.css'
import { withBase } from '../utils/assetPath.js'


const HOME_CREDITS = [{ name: 'NOOL', href: 'https://www.facebook.com/alexia28nool/' }]

export default function Home() {
  return (
    <div className={styles.page}>
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
              <img src={project.image} alt={project.title} />
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

      <Footer variant="home" credits={HOME_CREDITS} />
    </div>
  )
}

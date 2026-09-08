import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation.jsx'
import Footer from '../components/Footer.jsx'
import styles from './About.module.css'

const ABOUT_TERMS =
  'TERMS AND CONDITIONS\n\n1. This website is a student portfolio project.\n2. All designs and images remain the intellectual property of Angeline Merwin Cainglet.\n3. @WEBDEV 2025'

export default function About() {
  const navigate = useNavigate()
  const blockRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(styles.inView, entry.isIntersecting)
        })
      },
      { threshold: 0.15 },
    )

    blockRefs.current.forEach((block) => block && observer.observe(block))
    return () => observer.disconnect()
  }, [])

  const setBlockRef = (index) => (el) => {
    blockRefs.current[index] = el
  }

  return (
    <div className={styles.page}>
      <Navigation />

      <div className={styles.pageWrapper}>
        <section className={styles.heroTop}>
          <div className={styles.headline}>
            <span className={styles.headlineWord}>ART</span>
            <span className={styles.headlineWord}>MODERN</span>
            <span className={styles.headlineWord}>INSPIRED</span>
          </div>
          <p className={styles.tagline}>If you have a home, it deserves beauty.</p>
        </section>

        <section className={styles.heroBottom}>
          <div className={styles.heroImage}>
            <img src="/assets/images/angel.png" alt="Angeline Merwin Cainglet" />
          </div>

          <div className={styles.story}>
            <div
              ref={setBlockRef(0)}
              className={`${styles.storyBlock} ${styles.storyBlockMain}`}
            >
              <p className={styles.storyLabel}>My Story</p>
              <p>
                Hi! I'm <strong>Angeline Merwin Cainglet</strong>, a 20-year-old Architecture
                student from the Polytechnic University of the Philippines.
              </p>
            </div>

            <div ref={setBlockRef(1)} className={`${styles.storyBlock} ${styles.storyBlockMid}`}>
              <p>
                I've always loved designing spaces that feel beautiful, comfortable, and full of
                life.
              </p>
            </div>

            <div
              ref={setBlockRef(2)}
              className={`${styles.storyBlock} ${styles.storyBlockBottom}`}
            >
              <p>
                Even as a student, I've already created eye-catching interior design projects
                that show my passion for style and detail.
              </p>
            </div>

            <div className={styles.storyFooter}>
              <button className={styles.btnViewProjects} onClick={() => navigate('/gallery')}>
                View My Projects
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer termsText={ABOUT_TERMS} />
    </div>
  )
}

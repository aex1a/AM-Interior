import { useEffect, useRef, useState } from 'react'
import Navigation from '../components/Navigation.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import { useProjects } from '../hooks/useProjects.js'
import styles from './Gallery.module.css'

export default function Gallery() {
  const { galleryProjects, beforeAfterProjects, loading } = useProjects()
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [sliderPercent, setSliderPercent] = useState(50)
  const [labelBeforeOpacity, setLabelBeforeOpacity] = useState(1)
  const [labelAfterOpacity, setLabelAfterOpacity] = useState(1)
  const [activeBna, setActiveBna] = useState(null)

  useEffect(() => {
    if (!activeBna && beforeAfterProjects.length) {
      setActiveBna(beforeAfterProjects[0])
    }
  }, [beforeAfterProjects, activeBna])

  const sliderRef = useRef(null)
  const draggingRef = useRef(false)

  const activeProject = galleryProjects.find((p) => p.id === activeProjectId)

  useEffect(() => {
    const updateFromClientX = (clientX) => {
      const slider = sliderRef.current
      if (!slider) return
      const rect = slider.getBoundingClientRect()
      let width = clientX - rect.left
      width = Math.max(0, Math.min(width, rect.width))
      const percentage = (width / rect.width) * 100

      setSliderPercent(percentage)
      setLabelBeforeOpacity(percentage < 15 ? 0 : 1)
      setLabelAfterOpacity(percentage > 85 ? 0 : 1)
    }

    const dragMove = (e) => {
      if (!draggingRef.current) return
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX)
      if (clientX !== undefined) updateFromClientX(clientX)
    }

    const dragEnd = () => {
      draggingRef.current = false
    }

    document.addEventListener('mousemove', dragMove)
    document.addEventListener('mouseup', dragEnd)
    document.addEventListener('touchmove', dragMove)
    document.addEventListener('touchend', dragEnd)

    return () => {
      document.removeEventListener('mousemove', dragMove)
      document.removeEventListener('mouseup', dragEnd)
      document.removeEventListener('touchmove', dragMove)
      document.removeEventListener('touchend', dragEnd)
    }
  }, [])

  const handleDragStart = (e) => {
    e.preventDefault()
    draggingRef.current = true
  }

  const handleBnaSelect = (project) => {
    setActiveBna(project)
    setSliderPercent(50)
    setLabelBeforeOpacity(1)
    setLabelAfterOpacity(1)
  }

  const viewProjectGallery = (id) => {
    setActiveProjectId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeProjectGallery = () => {
    setActiveProjectId(null)
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (activeProject) {
    return (
      <div className={styles.page}>
        <SEO
          title={`${activeProject.title} | AM Interior`}
          description={activeProject.description || `${activeProject.title} — ${activeProject.location}`}
          path={`/gallery${activeProject.slug ? `#${activeProject.slug}` : ''}`}
        />
        <Navigation />

        <div className={styles.projectGalleryPage + ' ' + styles.active}>
          <div className={styles.galleryHeader}>
            <h2>{activeProject.galleryTitle}</h2>
            <button className={styles.galleryButton} onClick={closeProjectGallery}>
              Back to Projects <i className="fas fa-arrow-left"></i>
            </button>
          </div>
          <div className={styles.galleryGrid}>
            {activeProject.galleryImages.map((img, i) => (
              <img key={img} src={img} alt={`${activeProject.title} Gallery Image ${i + 1}`} />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <SEO
        title="Interior Design Projects & Portfolio | AM Interior"
        description="Browse AM Interior's portfolio of residential and commercial interior design projects across the Philippines, plus before-and-after transformations."
        path="/gallery"
      />
      <Navigation />

      <section id="home" className={styles.heroSection} aria-label="Hero Section: 2025 Projects Portfolio">
        <div className={styles.heroContentWrapper}>
          <div className={styles.portfolioBox}>
            <h2>PORTFOLIO</h2>
            <h1>2025 Projects</h1>
            <p>
              showcases elegant, tailor-made designs for both residential and commercial spaces,
              ensuring that each project reflects my professional expertise and personal style.
            </p>
          </div>
        </div>
      </section>

      <div className={styles.mainContentWrapper}>
        <section id="projects" className={styles.projectsContainer}>
          {galleryProjects.map((project, index) => (
            <div
              className={`${styles.projectItem} ${project.reverse ? styles.reverse : ''}`}
              key={project.id}
            >
              <div className={styles.projectImageBox}>
                <img src={project.image} alt={project.imageAlt} />
              </div>
              <div className={styles.projectDetails}>
                <div
                  className={project.reverse ? styles.projectDetailsContents : styles.projectDetailsContent}
                >
                  <span className={styles.projectNumber}>0{index + 1}</span>
                  <h3>{project.title}</h3>
                  <p className={styles.location}>{project.location}</p>
                  <p className={styles.description}>{project.description}</p>
                  <button
                    className={styles.galleryButton}
                    onClick={() => viewProjectGallery(project.id)}
                  >
                    View Gallery <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section id="before-after" className={styles.beforeAfterSection}>
          <p className={styles.bnaTitle}>BEFORE AND AFTER</p>
          <div className={styles.bnaDivider}></div>

          {activeBna && (
          <div className={styles.bnaWrapper}>
            <nav className={styles.bnaNav} aria-label="Before and After Project Selection">
              {beforeAfterProjects.map((project) => (
                <a
                  key={project.id}
                  href="#"
                  className={activeBna.id === project.id ? styles.active : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    handleBnaSelect(project)
                  }}
                  aria-label={`View ${project.label}`}
                >
                  {project.label}
                </a>
              ))}
            </nav>

            <div className={styles.imageSliderFrame}>
              <div className={styles.imageSliderContainer}>
                <div className={styles.imageSlider} ref={sliderRef}>
                  <div className={`${styles.label} ${styles.labelAfter}`} style={{ opacity: labelAfterOpacity }}>
                    AFTER
                  </div>
                  <div className={`${styles.label} ${styles.labelBefore}`} style={{ opacity: labelBeforeOpacity }}>
                    BEFORE
                  </div>

                  <img className={styles.afterImg} src={activeBna.after} alt="After" />
                  <img
                    className={styles.beforeImg}
                    src={activeBna.before}
                    alt="Before"
                    style={{ clipPath: `inset(0 ${100 - sliderPercent}% 0 0)` }}
                  />

                  <div
                    className={styles.sliderHandle}
                    role="slider"
                    aria-label="Image Comparison Slider"
                    aria-valuenow={Math.round(sliderPercent)}
                    style={{ left: `${sliderPercent}%` }}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  )
}

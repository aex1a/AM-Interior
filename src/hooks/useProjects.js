import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import {
  featuredProjects as staticFeatured,
  galleryProjects as staticGallery,
  beforeAfterProjects as staticBeforeAfter,
} from '../data/projects.js'

// Shapes a Supabase `projects` row (+ its project_images rows) into the same
// shape the existing UI components already expect from src/data/projects.js,
// so Home.jsx / Gallery.jsx need only swap their data source, not their JSX.
function shapeProject(row, images) {
  const gallery = images
    .filter((img) => img.image_type === 'gallery')
    .sort((a, b) => a.sort_order - b.sort_order)
  const before = images.find((img) => img.image_type === 'before')
  const after = images.find((img) => img.image_type === 'after')

  return {
    id: row.id,
    slug: row.slug,
    reverse: false,
    image: row.cover_image || gallery[0]?.image_url || '',
    imageAlt: row.title,
    title: row.title,
    location: row.location ? `Location: ${row.location}` : '',
    description: row.description,
    featured: row.featured,
    galleryTitle: `${row.title} Gallery`,
    galleryImages: gallery.map((img) => img.image_url),
    before: before?.image_url,
    after: after?.image_url,
  }
}

/**
 * Loads projects for the public site. Falls back to the original static
 * arrays in src/data/projects.js when Supabase hasn't been configured yet
 * (missing .env) so the site never breaks during setup.
 */
export function useProjects() {
  const [state, setState] = useState({
    loading: isSupabaseConfigured,
    error: null,
    featuredProjects: staticFeatured,
    galleryProjects: staticGallery,
    beforeAfterProjects: staticBeforeAfter,
  })

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    async function load() {
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })

      if (projectsError) {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: projectsError.message }))
        return
      }

      const { data: images, error: imagesError } = await supabase
        .from('project_images')
        .select('*')
        .order('sort_order', { ascending: true })

      if (imagesError) {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: imagesError.message }))
        return
      }

      const shaped = projects.map((p) =>
        shapeProject(
          p,
          images.filter((img) => img.project_id === p.id),
        ),
      )
      shaped.forEach((p, i) => {
        p.reverse = i % 2 === 1
      })

      const featured = shaped
        .filter((p) => p.featured)
        .map((p) => ({ image: p.image, title: p.title, location: p.location.replace(/^Location:\s*/, '') }))

      const beforeAfter = shaped
        .filter((p) => p.before && p.after)
        .map((p, i) => ({ id: p.id, label: `PROJECT ${i + 1}`, before: p.before, after: p.after }))

      if (!cancelled) {
        setState({
          loading: false,
          error: null,
          featuredProjects: featured.length ? featured : staticFeatured,
          galleryProjects: shaped.length ? shaped : staticGallery,
          beforeAfterProjects: beforeAfter.length ? beforeAfter : staticBeforeAfter,
        })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

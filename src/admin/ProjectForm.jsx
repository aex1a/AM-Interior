import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, PROJECT_IMAGES_BUCKET } from '../lib/supabaseClient.js'
import styles from './admin.module.css'

const IMAGE_TYPES = ['gallery', 'before', 'after']

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProjectForm() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    location: '',
    year: new Date().getFullYear(),
    category: 'Residential',
    featured: false,
    status: 'published',
    cover_image: '',
  })
  const [images, setImages] = useState([]) // { id?, image_url, image_type, alt_text, sort_order, file? }
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    async function load() {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      if (projectError) {
        setError(projectError.message)
        setLoading(false)
        return
      }
      const { data: imgs } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', id)
        .order('sort_order', { ascending: true })

      setForm(project)
      setImages(imgs || [])
      setLoading(false)
    }
    load()
  }, [id, isNew])

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [field]: value }))
  }

  const handleTitleBlur = () => {
    if (isNew && !form.slug && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }))
    }
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    setError('')

    try {
      const uploaded = []
      for (const file of files) {
        const path = `${Date.now()}-${slugify(file.name)}`
        const { error: uploadError } = await supabase.storage
          .from(PROJECT_IMAGES_BUCKET)
          .upload(path, file)
        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from(PROJECT_IMAGES_BUCKET)
          .getPublicUrl(path)

        uploaded.push({
          image_url: publicUrlData.publicUrl,
          image_type: 'gallery',
          alt_text: form.title,
          sort_order: images.length + uploaded.length,
        })
      }
      setImages((imgs) => [...imgs, ...uploaded])
    } catch (uploadErr) {
      setError(uploadErr.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const updateImage = (index, patch) => {
    setImages((imgs) => imgs.map((img, i) => (i === index ? { ...img, ...patch } : img)))
  }

  const removeImage = (index) => {
    setImages((imgs) => imgs.filter((_, i) => i !== index))
  }

  const setCoverFromImage = (url) => {
    setForm((f) => ({ ...f, cover_image: url }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      location: form.location,
      year: form.year ? Number(form.year) : null,
      category: form.category,
      featured: form.featured,
      status: form.status,
      cover_image: form.cover_image || images[0]?.image_url || null,
    }

    let projectId = id
    if (isNew) {
      const { data, error: insertError } = await supabase
        .from('projects')
        .insert(payload)
        .select()
        .single()
      if (insertError) {
        setError(insertError.message)
        setSaving(false)
        return
      }
      projectId = data.id
    } else {
      const { error: updateError } = await supabase.from('projects').update(payload).eq('id', id)
      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }
    }

    // Replace image rows: delete existing, re-insert current list. Simple
    // and reliable for the small number of images a portfolio project has.
    await supabase.from('project_images').delete().eq('project_id', projectId)
    if (images.length) {
      const rows = images.map((img, i) => ({
        project_id: projectId,
        image_url: img.image_url,
        image_type: img.image_type,
        alt_text: img.alt_text || form.title,
        sort_order: i,
      }))
      const { error: imagesError } = await supabase.from('project_images').insert(rows)
      if (imagesError) {
        setError(imagesError.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    navigate('/admin/projects')
  }

  if (loading) return <p>Loading…</p>

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>{isNew ? 'Add Project' : 'Edit Project'}</h1>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input id="title" value={form.title} onChange={handleChange('title')} onBlur={handleTitleBlur} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="slug">Slug (used in the project URL)</label>
          <input id="slug" value={form.slug} onChange={handleChange('slug')} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={4} value={form.description} onChange={handleChange('description')} />
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label htmlFor="location">Location</label>
            <input id="location" value={form.location} onChange={handleChange('location')} />
          </div>
          <div className={styles.field}>
            <label htmlFor="year">Year</label>
            <input id="year" type="number" value={form.year || ''} onChange={handleChange('year')} />
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={handleChange('category')}>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Food Court</option>
              <option>Other</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="status">Status</label>
            <select id="status" value={form.status} onChange={handleChange('status')}>
              <option value="published">Published (visible on site)</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </div>
        </div>

        <div className={styles.checkboxRow}>
          <input id="featured" type="checkbox" checked={form.featured} onChange={handleChange('featured')} />
          <label htmlFor="featured">Show in "Featured Projects" on the homepage</label>
        </div>

        <div className={styles.field}>
          <label>Project Images</label>
          <label className={styles.uploadBox}>
            {uploading ? 'Uploading…' : 'Click to upload one or more images'}
            <input type="file" accept="image/*" multiple hidden onChange={handleFileSelect} disabled={uploading} />
          </label>

          {images.length > 0 && (
            <div className={styles.imageGrid}>
              {images.map((img, i) => (
                <div className={styles.imageItem} key={img.image_url + i}>
                  <img
                    src={img.image_url}
                    alt=""
                    onClick={() => setCoverFromImage(img.image_url)}
                    title="Click to set as cover image"
                  />
                  <button type="button" className={styles.imageRemove} onClick={() => removeImage(i)}>
                    ×
                  </button>
                  <select
                    className={styles.imageTypeSelect}
                    value={img.image_type}
                    onChange={(e) => updateImage(i, { image_type: e.target.value })}
                  >
                    {IMAGE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.4rem' }}>
            Click a thumbnail to set it as the cover image shown in listings.
            {form.cover_image ? ' Current cover is highlighted implicitly by URL match.' : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className={styles.btnPrimary} type="submit" disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save Project'}
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => navigate('/admin/projects')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

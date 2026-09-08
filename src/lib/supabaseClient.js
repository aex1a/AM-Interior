import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// True once real Supabase credentials have been provided via .env.
// The rest of the app uses this flag to gracefully fall back to the
// original static data in src/data/projects.js when the backend isn't
// configured yet (e.g. first clone, or a preview build).
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const PROJECT_IMAGES_BUCKET = 'project-images'

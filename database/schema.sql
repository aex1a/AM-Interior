
-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- 1. PROJECTS
-- -------------------------------------------------------------------------
create table if not exists projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  description  text default '',
  location     text default '',
  year         int,
  category     text default 'Residential',
  cover_image  text,               -- URL of the main/cover image
  featured     boolean default false,
  status       text default 'published' check (status in ('draft', 'published')),
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- -------------------------------------------------------------------------
-- 2. PROJECT_IMAGES  (gallery + before/after images per project)
-- -------------------------------------------------------------------------
create table if not exists project_images (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  image_url    text not null,
  image_type   text default 'gallery' check (image_type in ('gallery', 'before', 'after')),
  alt_text     text default '',
  sort_order   int default 0,
  created_at   timestamptz default now()
);

-- -------------------------------------------------------------------------
-- 3. MESSAGES  (contact form submissions)
-- -------------------------------------------------------------------------
create table if not exists messages (
  id           uuid primary key default gen_random_uuid(),
  first_name   text not null,
  last_name    text not null,
  email        text not null,
  contact      text,
  message      text not null,
  status       text default 'new' check (status in ('new', 'read', 'archived')),
  created_at   timestamptz default now()
);

-- -------------------------------------------------------------------------
-- Keep updated_at current on projects
-- -------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated_at on projects;
create trigger trg_projects_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- -------------------------------------------------------------------------
-- Row Level Security
-- -------------------------------------------------------------------------
alter table projects        enable row level security;
alter table project_images  enable row level security;
alter table messages        enable row level security;

-- Public (anon) visitors mayREAD published projects and their images.
drop policy if exists "Public can read published projects" on projects;
create policy "Public can read published projects"
  on projects for select
  to anon
  using (status = 'published');

drop policy if exists "Public can read images of published projects" on project_images;
create policy "Public can read images of published projects"
  on project_images for select
  to anon
  using (
    exists (
      select 1 from projects
      where projects.id = project_images.project_id
        and projects.status = 'published'
    )
  );

-- Public (anon) visitors may INSERT a contact message, but never read/edit
-- any message (that would leak everyone else's contact details).
drop policy if exists "Public can submit a message" on messages;
create policy "Public can submit a message"
  on messages for insert
  to anon
  with check (true);

-- Logged-in admins get full read/write access to everything.
drop policy if exists "Admins manage projects" on projects;
create policy "Admins manage projects"
  on projects for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins manage project images" on project_images;
create policy "Admins manage project images"
  on project_images for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins manage messages" on messages;
create policy "Admins manage messages"
  on messages for all
  to authenticated
  using (true)
  with check (true);

-- -------------------------------------------------------------------------
-- Storage bucket for uploaded project photos
-- -------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Anyone can view files in the (public) bucket.
drop policy if exists "Public can view project images" on storage.objects;
create policy "Public can view project images"
  on storage.objects for select
  to public
  using (bucket_id = 'project-images');

-- Only logged-in admins can upload/replace/delete files in that bucket.
drop policy if exists "Admins can upload project images" on storage.objects;
create policy "Admins can upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

drop policy if exists "Admins can update project images" on storage.objects;
create policy "Admins can update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Admins can delete project images" on storage.objects;
create policy "Admins can delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');

-- -------------------------------------------------------------------------
-- Seed data — mirrors what is currently hardcoded in src/data/projects.js,
-- so the site keeps working immediately after you switch it over.
-- Safe to delete afterwards from the Admin dashboard.
-- -------------------------------------------------------------------------
insert into projects (slug, title, description, location, year, category, cover_image, featured, sort_order)
values
  ('residential-house-tarlac',
   'Residential House',
   'A warm, family-focused residential design.',
   'Santa Barbara, Victoria, Tarlac', 2025, 'Residential', null, true, 1),
  ('residential-house-qc',
   'Residential House',
   'A modern residential renovation project.',
   'Dinorado St., Palayan, Payatas A, Quezon City', 2025, 'Residential', null, true, 2),
  ('modern-tropical-residential-house-cebu',
   'Modern Tropical Residential House',
   'The design combines natural elements with a modern touch, creating a bright and airy tropical home. It focuses on comfort, openness, and harmony with the surroundings.',
   'Vicente Rama Ave., Busay Poblacion, Cebu City', 2025, 'Residential', null, true, 3),
  ('zero-waste-cafe-marikina',
   'Zero-Waste Cafe',
   'The design uses natural materials and soft tones to create a cozy, eco-friendly café that promotes sustainable living. People can relax and enjoy a mindful dining experience.',
   'Isabelo Mendoza Street, Barangay San Roque, Marikina City', 2025, 'Commercial', null, true, 4)
on conflict (slug) do nothing;

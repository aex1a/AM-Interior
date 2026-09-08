# AM Interior — Database & Admin CMS Setup Guide

This walks through every step to turn on the Supabase backend that powers
the new Admin Dashboard (`/admin`), dynamic projects, and the contact-form
inbox. Follow it in order — nothing is optional except where noted.

---

## Part 1 — Create your Supabase project

1. Go to **https://supabase.com** and click **Start your project**.
2. Sign up (GitHub login is fastest) — the free tier is enough for this site.
3. Click **New project**.
   - **Name**: `am-interior` (anything is fine)
   - **Database password**: generate/save a strong one — you won't need it
     day-to-day, but store it somewhere safe (e.g. a password manager).
   - **Region**: pick the one closest to your visitors (e.g. Singapore for
     the Philippines).
4. Click **Create new project** and wait ~2 minutes while it provisions.

---

## Part 2 — Run the database schema

1. In the left sidebar of your new project, click **SQL Editor**.
2. Click **New query**.
3. Open `database/schema.sql` from this project, copy its **entire
   contents**, and paste it into the SQL editor.
4. Click **Run** (or press Ctrl/Cmd+Enter).
5. You should see "Success. No rows returned." This creates:
   - `projects`, `project_images`, `messages` tables
   - Row Level Security policies (public visitors can read published
     projects and submit contact messages; only a logged-in admin can
     write/edit/delete anything)
   - A public storage bucket called `project-images` for uploaded photos
   - Seed data matching the 4 projects already on your site, so nothing
     breaks the moment you switch over

To confirm it worked: click **Table Editor** in the sidebar — you should
see `projects` (4 rows), `project_images` (0 rows), and `messages` (0 rows).

---

## Part 3 — Verify the storage bucket

1. Click **Storage** in the sidebar.
2. You should see a bucket named **project-images** marked **Public**.
   (The schema script created this automatically. If it's missing, click
   **New bucket**, name it exactly `project-images`, and toggle **Public
   bucket** on — then re-run just the storage policy section near the
   bottom of `schema.sql`.)

---

## Part 4 — Get your API keys

1. Click the **gear icon (Project Settings)** in the sidebar, then **API**.
2. You'll need two values:
   - **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
   - **anon public key** — a long string under "Project API keys"
3. Keep this tab open — you'll paste these next.

> The anon key is meant to be public (it ships inside your website's
> JavaScript bundle). Real protection comes from the Row Level Security
> policies you just installed, not from hiding this key.

---

## Part 5 — Configure the website

1. In the project folder, copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and paste in your real values:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-long-anon-key-here
   ```
3. Save the file. `.env` is already in `.gitignore`, so it will never be
   committed to GitHub — good, since it's specific to your machine/deploy.
4. Install dependencies and start the dev server to confirm it connects:
   ```bash
   npm install
   npm run dev
   ```
5. Open the site locally and go to `/admin/login`. If the yellow "Supabase
   isn't configured" warning is gone, your `.env` is wired up correctly.

---

## Part 6 — Create your admin login

The Admin Dashboard uses Supabase's own login system — there's no separate
username/password stored in your code.

1. Back in the Supabase dashboard, click **Authentication** in the sidebar.
2. Click **Add user** → **Create new user**.
3. Enter the email and password you (the site owner) want to log in with.
4. Leave **Auto Confirm User** turned on so you don't need to click an
   email confirmation link.
5. Click **Create user**.

That's it — this is now your Admin login. Repeat this step for any other
person who should have admin access (e.g. the client). There's no
public "sign up" page, which is intentional — only accounts you create
here can log in.

---

## Part 7 — Log in and test the CMS

1. With `npm run dev` running, visit `http://localhost:5173/admin/login`
   (path may include the `/AM-Interior/` base prefix in a full build).
2. Sign in with the email/password from Part 6.
3. You should land on the Dashboard showing 4 projects (from the seed data).
4. Click **Projects → Add Project**, fill in the fields, upload an image,
   and save. Then open the public **Gallery** page — your new project
   should now appear there, no code changes or redeploy needed.
5. Go to the public **Contact** page and submit a test inquiry, then check
   **Messages** in the admin — it should appear there instantly.

---

## Part 8 — Deploying with your database connected

This site deploys to GitHub Pages via `npm run deploy` (the `gh-pages`
package), which builds locally and pushes the `dist/` folder. Because Vite
bundles `VITE_...` env vars in **at build time**, your local `.env` file
(from Part 5) is all you need — just make sure it's present before you run:

```bash
npm run build   # bundles your real Supabase URL/key into dist/
npm run deploy  # pushes dist/ to the gh-pages branch
```

If you ever move this build step into GitHub Actions/CI instead of
building locally, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as
**repository secrets** (Settings → Secrets and variables → Actions) and
pass them as env vars to the build step — never commit them into a
workflow file in plain text.

---

## What's now dynamic vs. what's still static

| Area | Status |
|---|---|
| Projects (title, description, images, featured flag) | Fully dynamic via `projects` + `project_images` tables |
| Contact form submissions | Saved to `messages` table, visible in Admin |
| Ongoing Projects list (homepage) | Still static (`src/data/projects.js`) — low-value to move to a DB table for 2–3 short lines; ask if you want this too |
| About page bio/photo | Still static — content changes rarely, wasn't in scope of the CMS ask |

If you want the "Ongoing Projects" strip or About page content editable
from the Admin too, that's a small additional table + form, same pattern
as `projects` — say the word and it can be added.

---

## Troubleshooting

- **"Supabase isn't configured" warning won't go away** — double check
  `.env` is in the project root (same folder as `package.json`), the
  variable names are spelled exactly `VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY`, and you restarted `npm run dev` after creating
  `.env` (Vite only reads it on startup).
- **Login fails with "Invalid login credentials"** — recheck the email
  typed in Supabase Authentication → Users, and that Auto Confirm was on.
- **Images don't show after upload** — check Storage → project-images
  bucket is still marked Public, and that the storage policies from
  `schema.sql` ran without error.
- **New projects don't appear on the live gallery** — the project's
  **Status** field must be `published`, not `draft`.

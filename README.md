# Forge

**Altitude AI Delivery Platform**

A project delivery and knowledge management platform built with Next.js 14, Supabase, and Tailwind CSS.

![Forge](https://img.shields.io/badge/Status-Production--Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

### Core Modules
- **Dashboard** — Overview of projects, tasks, and activity
- **Projects** — Full project management with milestones and progress tracking
- **Tasks** — Kanban board with drag-and-drop (planned)
- **Knowledge Base** — Markdown-based documentation and playbooks
- **Activity** — Timeline of all project activity
- **Commercial** — Revenue tracking and profitability (Super Admin only)
- **Settings** — User management and role permissions

### Role-Based Access Control
| Role | Access |
|------|--------|
| **Super Admin** | Full access including commercial data and settings |
| **Admin** | All project data, no commercial visibility |
| **Delivery Partner** | Assigned projects only |
| **Client** | Their own projects only |

### Technical Features
- Server-side rendering with Next.js App Router
- Row-Level Security (RLS) in PostgreSQL
- Real-time subscriptions (planned)
- PWA support — installable on mobile
- Dark industrial theme

---

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)

### 1. Clone and Install

```bash
git clone https://github.com/altitudeaico/forge.git
cd forge
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy your URL and anon key
3. Create `.env.local`:

```bash
cp .env.example .env.local
```

4. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Migrations

In Supabase SQL Editor, run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, Row-Level Security policies, and seed data.

### 4. Create Your Admin User

1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000/signup`
3. Create an account
4. In Supabase Table Editor, find your user in `profiles` table
5. Change `role` from `client` to `super_admin`

### 5. Start Building

```bash
npm run dev
```

Visit `http://localhost:3000` — you're in!

---

## Project Structure

```
forge/
├── app/                        # Next.js App Router
│   ├── auth/                   # Login/Signup pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/            # Protected routes
│   │   ├── page.tsx            # Dashboard
│   │   ├── projects/           # Projects list + detail
│   │   ├── tasks/              # Kanban board
│   │   ├── knowledge/          # Knowledge base
│   │   ├── activity/           # Activity timeline
│   │   ├── commercial/         # Financial data
│   │   └── settings/           # User management
│   ├── layout.tsx
│   ├── page.tsx                # Redirect
│   └── globals.css
├── components/
│   ├── layout/                 # Sidebar, TopBar, MobileNav
│   └── ui/                     # Reusable components
├── lib/
│   ├── supabase/               # Client, server, types
│   └── utils/                  # Helpers
├── supabase/
│   └── migrations/             # SQL schema
├── public/
│   └── manifest.json           # PWA config
├── middleware.ts               # Auth middleware
├── tailwind.config.ts
└── package.json
```

---

## Database Schema

### Tables
- `profiles` — User profiles (extends auth.users)
- `projects` — Client projects
- `project_assignments` — User-project assignments
- `milestones` — Project milestones
- `tasks` — Individual tasks
- `kb_categories` — Knowledge base categories
- `kb_articles` — Knowledge base articles
- `activities` — Activity log
- `files` — Uploaded files
- `meetings` — Meeting notes
- `comments` — Task/project comments

### Row-Level Security
All tables have RLS policies that enforce:
- Super Admin/Admin see all data
- Delivery Partners see assigned projects
- Clients see their own projects
- Internal content hidden from clients

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Manual

```bash
npm run build
npm start
```

---

## Development

### Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run db:migrate   # Push migrations to Supabase
npm run db:types     # Generate TypeScript types
```

### Adding a New Page

1. Create folder in `app/(dashboard)/`
2. Add `page.tsx` with server component
3. Add to navigation in `components/layout/Sidebar.tsx`
4. Add role check if restricted

### Adding a New Component

1. Create in `components/ui/` for reusable
2. Create in `components/features/` for feature-specific
3. Export from `index.tsx`

---

## Roadmap

- [ ] Drag-and-drop task board
- [ ] File upload to Supabase Storage
- [ ] Real-time updates with subscriptions
- [ ] Email notifications via Resend
- [ ] Markdown editor for Knowledge Base
- [ ] Mobile app (React Native or Capacitor)

---

## License

Proprietary — Altitude AI Consulting

---

## Support

Questions? Contact [bolaji@altitudeai.co.uk](mailto:bolaji@altitudeai.co.uk)

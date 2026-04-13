# Forge Deployment Guide

Complete guide to deploying Forge to production.

---

## Option 1: Vercel (Recommended)

### Step 1: Push to GitHub

```bash
# Create new repo at github.com/altitudeaico/forge
# Then push:

cd forge
git remote add origin https://github.com/altitudeaico/forge.git
git push -u origin main
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project (Free tier is fine)
3. Wait for database to provision (~2 mins)
4. Go to **SQL Editor** and run:
   - `001_initial_schema.sql` (creates tables + RLS)
   - `002_seed_data.sql` (adds test data)

### Step 3: Get Supabase Credentials

1. Go to **Settings > API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New > Project**
3. Import your GitHub repo
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
5. Click **Deploy**

### Step 5: Create Admin User

1. Visit your deployed site
2. Go to `/signup` and create account
3. In Supabase **Table Editor**:
   - Open `profiles` table
   - Find your user
   - Change `role` to `super_admin`
4. Refresh the app — you now have full access

---

## Option 2: Railway/Render

Similar process:
1. Connect GitHub repo
2. Set environment variables
3. Deploy

---

## Custom Domain

### Vercel
1. Go to Project Settings > Domains
2. Add `forge.altitudeai.co.uk`
3. Add DNS records to your domain provider

### DNS Records
```
Type: CNAME
Name: forge
Value: cname.vercel-dns.com
```

---

## Post-Deployment

### Test Checklist
- [ ] Login works
- [ ] Signup works (check email if enabled)
- [ ] Dashboard loads
- [ ] Projects list shows seed data
- [ ] Create new project works
- [ ] Tasks kanban renders
- [ ] Knowledge base articles load
- [ ] Commercial page (super_admin only)
- [ ] Settings page (super_admin only)
- [ ] Mobile responsive layout
- [ ] PWA installable

### Enable Email Invites (Optional)

1. Create [Resend](https://resend.com) account
2. Add `RESEND_API_KEY` to Vercel
3. Implement email sending in `InviteUserButton.tsx`

---

## Troubleshooting

### "Invalid API key"
- Check env vars are set in Vercel
- Ensure no trailing spaces in keys
- Redeploy after adding vars

### "Permission denied" errors
- RLS policies not applied
- Run migration SQL again
- Check user role in profiles table

### Blank page
- Check browser console for errors
- Verify Supabase URL is correct
- Check network tab for failed requests

---

## Production Checklist

- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Environment variables secure
- [ ] Database backups enabled (Supabase dashboard)
- [ ] Error monitoring (Vercel Analytics or Sentry)
- [ ] Admin user created with super_admin role

---

## Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel | 100GB bandwidth | $20/mo |
| Supabase | 500MB DB, 1GB storage | $25/mo |
| Resend | 3,000 emails/mo | $20/mo |

**Total: £0/mo** for low usage, ~£50/mo at scale

---

## Support

Questions? Contact [bolaji@altitudeai.co.uk](mailto:bolaji@altitudeai.co.uk)

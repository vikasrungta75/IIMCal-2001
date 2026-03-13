# 🎓 IIM Calcutta — Silver Jubilee Alumni Meet 2025
### Official Alumni Portal | Batch 1999–2001

A production-ready full-stack web app for the 25th Silver Jubilee Reunion.
Built with **Next.js 14**, **NextAuth.js**, **Tailwind CSS**.
Deploy in minutes — completely **free** on Vercel.

---

## ✨ What's Inside

| Feature | Details |
|---|---|
| 🔐 **Google Sign-In** | One-click login with Gmail account (free, no passwords) |
| 🪟 **Microsoft / Hotmail** | One-click login with Outlook/Hotmail/Live account |
| 🔑 **Username + Password** | Classic login for alumni who prefer it |
| 📊 **Dashboard** | Personal welcome, event countdown, announcements, profile card |
| 👤 **Profile** | Batch, company, bio, LinkedIn, location, photo |
| ✈️ **Travel & Stay** | Arrival/departure, flight numbers, accommodation, dietary needs |
| 📣 **Announcements** | 6 pre-loaded posts, pinnable, filterable by category |
| 👥 **Alumni Directory** | Searchable grid of all registered batchmates |
| 🛠️ **Admin Panel** | Post announcements, view registrations, CSV export, travel tracker |
| 🖼️ **Real Images** | Wikimedia Commons campus + Kolkata photos (free use, no copyright) |
| 🎬 **Campus Video** | IIM Calcutta official YouTube tour embedded on homepage |

---

## 🚀 FREE Hosting Options (Recommended Order)

### 🥇 Option 1 — Vercel (BEST for Next.js — recommended)
**Free tier:** 100GB bandwidth/month, unlimited deploys, auto HTTPS, custom domain
- Purpose-built for Next.js by the same team
- Instant global CDN, zero config
- Preview URLs for every git push

**Steps:**
```bash
# 1. Push to GitHub
git init && git add . && git commit -m "IIMC Silver Jubilee Portal"
git remote add origin https://github.com/YOUR_USERNAME/iimc-jubilee.git
git push -u origin main

# 2. Go to vercel.com → New Project → Import from GitHub
# 3. Add environment variables (see below)
# 4. Deploy — done!
```

### 🥈 Option 2 — Netlify (Good free alternative)
**Free tier:** 100GB bandwidth, 300 build minutes/month
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### 🥉 Option 3 — Railway (Best for persistent data later)
**Free trial:** $5 credit, then ~$5/month
- Better for when you add a real database
```bash
npm install -g @railway/cli
railway login && railway up
```

### ⚡ Local Testing (Right Now — No Account Needed)
```bash
cd iimc-jubilee
npm install
cp .env.example .env.local
# Edit .env.local with your secrets
npm run dev
# Open http://localhost:3000
```

---

## 🔑 Environment Variables

Create `.env.local` for local dev. Add these same variables in Vercel/Netlify dashboard for production.

```env
# REQUIRED — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-very-long-random-secret-at-least-32-chars

# REQUIRED — your deployed URL (no trailing slash)
NEXTAUTH_URL=https://your-project.vercel.app
# For local dev: NEXTAUTH_URL=http://localhost:3000

# GOOGLE OAUTH (free setup — 15 minutes)
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx

# MICROSOFT / HOTMAIL OAUTH (free setup — 15 minutes)
AZURE_AD_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_AD_CLIENT_SECRET=your-azure-secret
AZURE_AD_TENANT_ID=common
```

**Without OAuth keys set:** The site still works perfectly with username/password login.
Google and Microsoft buttons will show an error — just ignore until you add the keys.

---

## 🔧 Setting Up Google Login (Free — 15 min)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **Create Project** → name it "IIMC Silver Jubilee"
3. **APIs & Services** → **OAuth consent screen**
   - User type: **External**
   - App name: "IIM Calcutta Silver Jubilee"
   - Support email: your email
   - Save and continue (skip scopes, skip test users)
4. **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for local)
     - `https://your-project.vercel.app/api/auth/callback/google` (for production)
5. Copy **Client ID** and **Client Secret** → paste into `.env.local`

---

## 🔧 Setting Up Microsoft / Hotmail Login (Free — 15 min)

1. Go to [portal.azure.com](https://portal.azure.com) (sign in with any Microsoft account)
2. Search **"App registrations"** → **New registration**
   - Name: "IIMC Silver Jubilee"
   - Supported account types: **"Accounts in any organizational directory and personal Microsoft accounts"** (covers Hotmail, Outlook, Live)
   - Redirect URI: Web → `http://localhost:3000/api/auth/callback/azure-ad`
3. After creation, copy the **Application (client) ID** → that's your `AZURE_AD_CLIENT_ID`
4. **Certificates & secrets** → **New client secret** → copy the **Value** (not the ID)
5. Add production redirect: Authentication → Add URI → `https://your-project.vercel.app/api/auth/callback/azure-ad`

---

## 🖼️ Images Used (All Free / Open License)

All images are sourced from **Wikimedia Commons** (CC licensed) and official IIMC website.
No stock photo subscriptions needed.

| Image | Source | License |
|---|---|---|
| IIM Calcutta MDC Building | Wikimedia Commons | Public domain |
| Howrah Bridge | Wikimedia Commons | CC BY-SA |
| Victoria Memorial | Wikimedia Commons | CC BY-SA |
| Kolkata Yellow Taxi | Wikimedia Commons | CC BY-SA |
| IIMC Logo & White Logo | iimcal.ac.in | Official use |

### Campus Video
Embedded from YouTube: Official IIM Calcutta campus tour.
URL: `https://www.youtube.com/embed/n7o3sDQ7B9g`

### Adding Your Own Images
Place images in `/public/images/` and reference as `/images/your-file.jpg`.

Recommended images to add:
```
public/
  images/
    hero-bg.jpg          ← Main hero background (campus aerial view)
    campus-lake.jpg      ← The famous 7 lakes
    auditorium.jpg       ← AC Auditorium
    convocation.jpg      ← Convocation hall
    batch-photo.jpg      ← Your batch photo from 1999-2001
    kolkata-food.jpg     ← Mishti doi, kathi roll etc
```

Free sources to download campus photos:
- [Wikimedia Commons - IIM Calcutta](https://commons.wikimedia.org/wiki/Category:Indian_Institute_of_Management_Calcutta)
- [IIMC Picture Gallery](https://www.iimcal.ac.in/picture-gallery)
- [Unsplash - Search "Kolkata"](https://unsplash.com/s/photos/kolkata) (free commercial use)

---

## 🗂️ Project Structure

```
iimc-jubilee/
├── app/
│   ├── page.tsx                 # Landing page with images + video
│   ├── login/page.tsx           # Login: Google + Microsoft + username/pw
│   ├── register/page.tsx        # 2-step registration form
│   ├── complete-profile/        # For new OAuth users (batch/programme)
│   ├── dashboard/page.tsx       # Main dashboard after login
│   ├── profile/page.tsx         # Edit full profile
│   ├── travel/page.tsx          # Travel & accommodation form
│   ├── announcements/page.tsx   # Announcements board
│   ├── alumni/page.tsx          # Alumni directory
│   ├── admin/page.tsx           # Admin panel
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth handler (Google/MS/Credentials)
│       ├── profile/             # GET/PUT profile
│       ├── travel/              # GET/POST travel info
│       ├── announcements/       # GET/POST/DELETE announcements
│       ├── alumni/              # GET directory
│       └── admin/stats/         # GET admin statistics
├── components/
│   ├── Navbar.tsx               # Top navigation bar
│   ├── Countdown.tsx            # Live event countdown timer
│   └── SessionProvider.tsx      # NextAuth session wrapper
├── lib/
│   ├── db.ts                    # Data layer (in-memory, 8 sample alumni)
│   ├── auth.ts                  # Session helper (NextAuth + legacy JWT)
│   └── nextauth.ts              # NextAuth config (providers + callbacks)
└── public/
    └── images/                  ← ADD YOUR CAMPUS PHOTOS HERE
```

---

## 🔑 Demo Credentials

| Role | Username | Password | Notes |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | Full admin panel access |
| **Alumni** | `rahulsharma` | `admin123` | Sample profile, McKinsey |
| **Alumni** | `priyamehra` | `admin123` | Sample profile, Goldman Sachs |
| **Alumni** | `karthiknair` | `admin123` | Sample profile, Google |

---

## 💾 Making Data Persistent (For Production)

The current store is **in-memory** — data resets when the server restarts.
Vercel's serverless functions also don't share memory between instances.

**Easiest upgrade path: Vercel KV (Redis) — free 30MB tier**

```bash
# 1. In Vercel dashboard: Storage → Create KV Database
# 2. Install the package
npm install @vercel/kv

# 3. Replace Map operations in lib/db.ts with:
import { kv } from '@vercel/kv';
await kv.hset('user:rahul', { fullName: 'Rahul Sharma', ... });
const user = await kv.hgetall('user:rahul');
```

**Or use Supabase (PostgreSQL — free 500MB tier)**
```bash
npm install @supabase/supabase-js
# Full migration guide: supabase.com/docs/guides/getting-started/nextjs
```

---

## 🚀 Vercel Deployment Checklist

- [ ] Push code to GitHub
- [ ] Import project on vercel.com
- [ ] Set `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
- [ ] Set `NEXTAUTH_URL` to your Vercel URL
- [ ] Set up Google OAuth and add `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
- [ ] Set up Microsoft OAuth and add `AZURE_AD_CLIENT_ID` + `AZURE_AD_CLIENT_SECRET`
- [ ] Add your Vercel URL to OAuth redirect lists in Google & Azure portals
- [ ] Change admin password via Profile page
- [ ] Add real batch photos to `/public/images/`
- [ ] Update event dates if needed (search for "2025-11-14" in codebase)
- [ ] Update contact email (search for "silverjubilee2025@gmail.com")
- [ ] (Optional) Upgrade to Vercel KV for persistent data

---

Built with ❤️ for IIM Calcutta Batch 1999–2001 | Silver Jubilee 2025

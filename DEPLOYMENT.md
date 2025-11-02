# Aroha MVP - Deployment Guide

## 🚀 Ready to Deploy!

Your Aroha MVP is production-ready with all features working, including optional Supabase cloud sync.

---

## Recommended: Deploy to Vercel (Free)

Vercel is the easiest and fastest way to deploy your React + Vite application.

### Prerequisites
- GitHub account
- Vercel account (free at https://vercel.com)
- Your code pushed to GitHub

### Step 1: Push to GitHub

```bash
# If not already initialized
git add .
git commit -m "feat: Aroha MVP with Supabase cloud sync"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_SUPABASE_URL = https://xbomrqjlmubclijialcg.supabase.co
     VITE_SUPABASE_ANON_KEY = [your-anon-key]
     ```
   - Apply to: Production, Preview, Development

6. Click "Deploy"
7. Wait 1-2 minutes
8. Your app is live! 🎉

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd aroha-mvp
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [your-account]
# - Link to existing project? No
# - What's your project's name? aroha-mvp
# - In which directory is your code located? ./
# - Want to override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your Supabase anon key

# Deploy to production
vercel --prod
```

### Step 3: Verify Deployment

1. Open your Vercel URL (e.g., `https://aroha-mvp.vercel.app`)
2. Test the app:
   - ✅ Home page loads
   - ✅ PHQ-9 assessment works
   - ✅ Settings → Cloud Sync section appears
   - ✅ Enable cloud sync
   - ✅ Complete assessment → check Supabase dashboard
   - ✅ History shows records
   - ✅ PDF export works

---

## Alternative: Deploy to Netlify (Free)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "feat: Aroha MVP ready for deployment"
git push origin main
```

### Step 2: Deploy to Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   
5. Add Environment Variables:
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_SUPABASE_URL = https://xbomrqjlmubclijialcg.supabase.co
     VITE_SUPABASE_ANON_KEY = [your-anon-key]
     ```

6. Click "Deploy site"
7. Your app is live at `https://aroha-mvp.netlify.app`

---

## Alternative: Deploy to GitHub Pages

### Step 1: Update vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/aroha-mvp/', // Change to your repo name
})
```

### Step 2: Add deploy script to package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 3: Install gh-pages and deploy

```bash
npm install -D gh-pages

# Deploy
npm run deploy
```

### Step 4: Configure GitHub Pages

1. Go to your GitHub repo → Settings → Pages
2. Source: Deploy from branch
3. Branch: `gh-pages` / `root`
4. Save

### Step 5: Add environment variables

**Note**: GitHub Pages doesn't support environment variables directly. You'll need to:
- Commit `.env` file (NOT recommended for production)
- OR use GitHub Actions secrets and build-time replacement

---

## Environment Variables for Production

Your deployment needs these environment variables:

```env
VITE_SUPABASE_URL=https://xbomrqjlmubclijialcg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Note**: The `anon` key is safe to expose publicly. It's designed for client-side use and protected by Row Level Security.

---

## Custom Domain (Optional)

### On Vercel:
1. Go to Project → Settings → Domains
2. Add your domain (e.g., `aroha.example.com`)
3. Update DNS records as instructed
4. SSL certificate auto-provisioned

### On Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records
4. SSL certificate auto-provisioned

---

## Post-Deployment Checklist

After deployment, verify:

- [ ] App loads without errors
- [ ] All pages accessible (PHQ-9, History, Settings, Privacy)
- [ ] Language switching works (English ↔ te reo Māori)
- [ ] PHQ-9 assessment submits successfully
- [ ] Cloud Sync section appears in Settings
- [ ] Can enable/disable cloud sync
- [ ] Records sync to Supabase
- [ ] History displays all records
- [ ] PDF export generates correctly
- [ ] Responsive design works on mobile
- [ ] Consent modal appears on first visit
- [ ] Audio player loads (if audio files added)
- [ ] Crisis resources display correctly

---

## Production Considerations

### 1. Update Supabase URL Restrictions (Optional)

For extra security, restrict API access to your domain:

1. Go to Supabase Dashboard → Settings → API
2. Under "URL Configuration" → Add allowed domains:
   - `https://aroha-mvp.vercel.app`
   - `https://your-custom-domain.com`

### 2. Enable Analytics (Optional)

Add analytics to track usage:

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `src/main.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

// In your root component
<Analytics />
```

**Plausible (Privacy-focused):**
```html
<!-- Add to index.html -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### 3. Set up Monitoring

- **Vercel**: Built-in Web Vitals monitoring
- **Sentry**: Error tracking (optional)
- **LogRocket**: Session replay (optional)

### 4. Backup Strategy

- Your Supabase data is automatically backed up by Supabase
- Export data regularly from Supabase dashboard
- Consider setting up automated backups

---

## Troubleshooting

### Environment variables not working?

**Vercel/Netlify:**
- Make sure variable names start with `VITE_`
- Redeploy after adding environment variables
- Check deployment logs for errors

### Build fails?

```bash
# Test build locally first
npm run build
npm run preview

# Check for TypeScript errors
npm run build 2>&1 | grep error
```

### Cloud sync not working in production?

1. Check browser console for errors
2. Verify environment variables are set
3. Test Supabase connection: `node scripts/test-supabase.mjs`
4. Check Supabase logs in dashboard

### 404 errors on page refresh?

**Vercel**: Automatically handled with `vercel.json`
**Netlify**: Add `_redirects` file:
```
/*    /index.html   200
```

---

## Quick Deploy Commands

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Manual Build
```bash
npm run build
# Upload 'dist' folder to your hosting provider
```

---

## Cost Estimate

- **Vercel Free Tier**: 
  - 100 GB bandwidth/month
  - Unlimited personal projects
  - ✅ Perfect for MVP

- **Netlify Free Tier**:
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - ✅ Perfect for MVP

- **Supabase Free Tier**:
  - 500 MB database
  - 5 GB bandwidth/month
  - Unlimited API requests
  - ✅ Sufficient for 1000+ users

**Total Cost**: $0/month for MVP testing! 🎉

---

## Next Steps After Deployment

1. ✅ Share URL with test users
2. ✅ Gather feedback
3. ✅ Monitor Supabase usage
4. ✅ Set up custom domain
5. ✅ Add analytics
6. ✅ Plan v2 features

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

**Your app is ready to go live!** 🚀

Choose your platform (Vercel recommended) and follow the steps above. You'll be live in under 5 minutes!

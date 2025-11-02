# ⚠️ Supabase Connection Issue Detected

## Problem Found

Your `.env` file contains:
```
VITE_SUPABASE_URL=https://Aroha.supabase.co
```

**This is incorrect!** ❌

The Supabase project URL should have a **unique project ID** (random alphanumeric string), not just "Aroha".

## ✅ Correct Format

Your URL should look like this:
```
VITE_SUPABASE_URL=https://xyzabcdefghijklm.supabase.co
```

Where `xyzabcdefghijklm` is a unique ID assigned by Supabase (usually 16-20 characters).

## 🛠️ How to Fix

### Option 1: If You Already Have a Supabase Project

1. Go to https://app.supabase.com
2. Sign in to your account
3. Select your project (or create one if you don't have any)
4. Click **Settings** (gear icon) in the left sidebar
5. Click **API** section
6. Copy the values:
   - **Project URL**: Something like `https://abcdefghijklmnop.supabase.co`
   - **anon public key**: Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

7. Update your `.env` file with the correct values:
   ```env
   VITE_SUPABASE_URL=https://your-real-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-real-key...
   ```

### Option 2: If You Haven't Created a Supabase Project Yet

Follow the complete setup guide in `docs/SUPABASE_SETUP.md`:

**Quick Steps:**

1. **Create Account & Project** (5 min)
   - Go to https://supabase.com
   - Click "Start your project" (free)
   - Sign up with GitHub or email
   - Click "New Project"
   - Choose organization
   - Enter:
     - **Name**: aroha-mvp (or any name you prefer)
     - **Database Password**: Generate strong password (save it!)
     - **Region**: Sydney (closest to NZ)
   - Click "Create new project"
   - Wait ~2 minutes for provisioning

2. **Get API Credentials** (1 min)
   - In your project dashboard
   - Click **Settings** → **API**
   - Copy **Project URL** (e.g., `https://abcd1234.supabase.co`)
   - Copy **anon public** key (long JWT token)

3. **Create Database Tables** (5 min)
   - Click **SQL Editor** in left sidebar
   - Copy the SQL from `docs/SUPABASE_SETUP.md` (Step 3)
   - Paste and click **Run**
   - Should see "Success. No rows returned"

4. **Update .env File**
   ```env
   VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-key
   ```

5. **Test Again**
   ```bash
   node scripts/test-supabase.mjs
   ```

## 🔍 Example of Correct Values

Here's what valid Supabase credentials look like:

```env
# ✅ CORRECT FORMAT
VITE_SUPABASE_URL=https://kbzwxqgpqrstuvwx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiendxZ3BxcnN0dXZ3eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk4NzY1NDMyLCJleHAiOjIwMTQzNDE0MzJ9.abcdefghijklmnopqrstuvwxyz1234567890

# ❌ INCORRECT FORMAT (what you currently have)
VITE_SUPABASE_URL=https://Aroha.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

## 🚀 After Fixing

Once you've updated your `.env` file with the correct credentials:

1. **Restart dev server** (if running):
   ```bash
   # Press Ctrl+C to stop, then:
   npm run dev
   ```

2. **Run test again**:
   ```bash
   node scripts/test-supabase.mjs
   ```

3. **Expected output**:
   ```
   🧪 Supabase Connection Test
   ==================================================
   ✅ Environment variables found
   ✅ Table exists
   ✅ Can insert records
   ✅ Can read records
   ✅ Can delete records
   ==================================================
   🎉 SUCCESS! Your Supabase integration is working perfectly!
   ```

4. **Enable in app**:
   - Open http://localhost:5173 (or 5174)
   - Go to Settings
   - You should see "Cloud Sync" section
   - Click "Enable" to start syncing!

## 📚 Full Documentation

For complete step-by-step instructions, see:
- `docs/SUPABASE_SETUP.md` - Detailed setup guide with SQL schema
- `docs/CLOUD_SYNC_IMPLEMENTATION.md` - Technical details

## ❓ Still Having Issues?

Common problems:

1. **URL still wrong?** 
   - Make sure you copied from Settings → API in Supabase dashboard
   - URL must be `https://[project-id].supabase.co` format

2. **Table doesn't exist?**
   - Run the SQL setup from `docs/SUPABASE_SETUP.md` Step 3

3. **Permission denied?**
   - Make sure you ran ALL the SQL commands including RLS policies

4. **Connection timeout?**
   - Check your internet connection
   - Verify the project ID in the URL is correct

## 💡 Pro Tip

The Supabase project URL is unique to YOUR project. You cannot use "Aroha" or any other custom name. Supabase automatically assigns a random ID when you create a project.

Think of it like GitHub repos:
- ❌ `github.com/my-cool-app` (doesn't work)
- ✅ `github.com/username/my-cool-app` (works)

Similarly:
- ❌ `https://Aroha.supabase.co` (doesn't exist)
- ✅ `https://kbzwxqgp.supabase.co` (your unique project)

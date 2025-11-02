# Supabase Setup Guide for Aroha MVP

This guide will help you set up Supabase for cloud sync functionality in the Aroha MVP application.

## Prerequisites

- A Supabase account (free tier available at https://supabase.com)
- Node.js and npm installed
- The Aroha MVP application cloned and dependencies installed

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Choose your organization or create a new one
4. Enter project details:
   - **Name**: aroha-mvp (or your preferred name)
   - **Database Password**: Generate a strong password (save this securely)
   - **Region**: Choose closest to your target users (e.g., Sydney for NZ)
   - **Pricing Plan**: Free tier is sufficient for MVP
5. Click "Create new project"
6. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on **Settings** (gear icon)
2. Navigate to **API** section
3. You'll see two important values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long JWT token starting with `eyJ...`
4. Copy both values (you'll need them in Step 4)

## Step 3: Create Database Tables

1. In your Supabase project, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the following SQL:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create phq9_records table
CREATE TABLE IF NOT EXISTS public.phq9_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    answers INTEGER[] NOT NULL,
    total INTEGER NOT NULL,
    severity TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT answers_length CHECK (array_length(answers, 1) = 9),
    CONSTRAINT answers_range CHECK (
        answers[1] BETWEEN 0 AND 3 AND
        answers[2] BETWEEN 0 AND 3 AND
        answers[3] BETWEEN 0 AND 3 AND
        answers[4] BETWEEN 0 AND 3 AND
        answers[5] BETWEEN 0 AND 3 AND
        answers[6] BETWEEN 0 AND 3 AND
        answers[7] BETWEEN 0 AND 3 AND
        answers[8] BETWEEN 0 AND 3 AND
        answers[9] BETWEEN 0 AND 3
    ),
    CONSTRAINT total_range CHECK (total BETWEEN 0 AND 27)
);

-- Create index for faster queries
CREATE INDEX idx_phq9_records_user_id ON public.phq9_records(user_id);
CREATE INDEX idx_phq9_records_created_at ON public.phq9_records(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.phq9_records ENABLE ROW LEVEL SECURITY;

-- Create policies for privacy
-- Users can only read their own records
CREATE POLICY "Users can view their own records"
    ON public.phq9_records
    FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' 
           OR user_id = current_setting('app.user_id', true));

-- Users can only insert their own records
CREATE POLICY "Users can insert their own records"
    ON public.phq9_records
    FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
                OR user_id = current_setting('app.user_id', true));

-- Users can only delete their own records
CREATE POLICY "Users can delete their own records"
    ON public.phq9_records
    FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
           OR user_id = current_setting('app.user_id', true));

-- Grant public access (controlled by RLS policies)
GRANT ALL ON public.phq9_records TO anon;
GRANT ALL ON public.phq9_records TO authenticated;

-- Create user_preferences table (optional, for future use)
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    language TEXT NOT NULL DEFAULT 'en',
    cloud_sync_enabled BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their preferences"
    ON public.user_preferences
    FOR ALL
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
           OR user_id = current_setting('app.user_id', true));

GRANT ALL ON public.user_preferences TO anon;
GRANT ALL ON public.user_preferences TO authenticated;
```

4. Click **Run** to execute the SQL
5. You should see "Success. No rows returned" message

## Step 4: Configure Environment Variables

1. In your Aroha MVP project root, copy the `.env.example` file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Replace with your actual values from Step 2

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser: http://localhost:5173

3. Navigate to **Settings** page

4. You should see a new "Cloud Sync" section (if Supabase is configured correctly)

5. Click **Enable** to turn on cloud sync

6. Complete a PHQ-9 assessment

7. Go to Supabase dashboard → **Table Editor** → `phq9_records`

8. You should see your record synced to the database!

## Step 6: Verify Row Level Security

Test that RLS is working correctly:

1. In Supabase SQL Editor, run:
   ```sql
   SELECT * FROM phq9_records;
   ```

2. You should see your records (because you're an admin)

3. Try accessing from a different anonymous user ID in the app to verify isolation

## Privacy and Security Notes

- **Row Level Security (RLS)**: All data is protected by RLS policies. Users can only access their own records.
- **Anonymous User IDs**: The app generates a unique anonymous ID stored in localStorage. This is not tied to personal identity.
- **Encryption**: All data is encrypted in transit (HTTPS) and at rest (Supabase default encryption).
- **No Authentication**: This MVP uses anonymous access. For production, consider adding proper authentication.

## Troubleshooting

### Cloud Sync section doesn't appear in Settings
- Check that `.env.local` exists and has correct values
- Restart the dev server after creating `.env.local`
- Verify environment variables are loaded: `console.log(import.meta.env.VITE_SUPABASE_URL)`

### Records not syncing to Supabase
- Check browser console for errors
- Verify your anon key has correct permissions
- Check Supabase logs in Dashboard → Logs
- Ensure RLS policies are correctly created

### "Missing required parameter" errors
- Double-check your environment variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Ensure there are no extra spaces or quotes in `.env.local`

### Database connection errors
- Verify your project is active in Supabase dashboard
- Check that your project URL is correct
- Ensure you're using the `anon` key, not the `service_role` key

## Next Steps

Once cloud sync is working:

1. **Test sync across devices**: Open the app on different browsers/devices with the same user ID
2. **Monitor usage**: Check Supabase dashboard for storage and API request metrics
3. **Add data deletion**: Implement cloud data deletion from Privacy settings
4. **Consider authentication**: For production, add proper user authentication
5. **Backup strategy**: Set up automatic database backups in Supabase

## Production Considerations

Before deploying to production:

- [ ] Set up proper authentication (Supabase Auth)
- [ ] Review and test all RLS policies
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Add monitoring and error tracking
- [ ] Review Supabase pricing for expected usage
- [ ] Consider data retention policies
- [ ] Add GDPR compliance features (data export, deletion)
- [ ] Test performance with larger datasets
- [ ] Set up staging environment

## Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Aroha MVP Repository: [Your GitHub repo URL]

---

**Note**: The free tier of Supabase includes:
- 500MB database space
- 5GB bandwidth
- 50,000 monthly active users
- Unlimited API requests

This should be sufficient for MVP testing and small-scale production use.

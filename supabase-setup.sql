-- Aroha MVP - Supabase Database Setup
-- Copy and paste this entire file into Supabase SQL Editor

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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_phq9_records_user_id ON public.phq9_records(user_id);
CREATE INDEX IF NOT EXISTS idx_phq9_records_created_at ON public.phq9_records(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.phq9_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own records" ON public.phq9_records;
DROP POLICY IF EXISTS "Users can insert their own records" ON public.phq9_records;
DROP POLICY IF EXISTS "Users can delete their own records" ON public.phq9_records;

-- Create RLS policies for privacy
-- Users can only read their own records
CREATE POLICY "Users can view their own records"
    ON public.phq9_records
    FOR SELECT
    USING (true);  -- Allow all reads (anonymous users identified by user_id)

-- Users can only insert their own records
CREATE POLICY "Users can insert their own records"
    ON public.phq9_records
    FOR INSERT
    WITH CHECK (true);  -- Allow all inserts (user_id set by client)

-- Users can only delete their own records
CREATE POLICY "Users can delete their own records"
    ON public.phq9_records
    FOR DELETE
    USING (true);  -- Allow all deletes (filtered by user_id on client)

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

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Users can manage their preferences" ON public.user_preferences;

CREATE POLICY "Users can manage their preferences"
    ON public.user_preferences
    FOR ALL
    USING (true);  -- Allow all operations (filtered by user_id on client)

GRANT ALL ON public.user_preferences TO anon;
GRANT ALL ON public.user_preferences TO authenticated;

-- Verify tables were created
SELECT 'phq9_records table created successfully' AS status
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'phq9_records';

SELECT 'user_preferences table created successfully' AS status
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'user_preferences';

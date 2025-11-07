-- Run these queries in Supabase SQL Editor to diagnose the 406 error

-- 1. Check diary_entries table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'diary_entries'
ORDER BY ordinal_position;

-- 2. Check user_id column type specifically
SELECT 
    column_name, 
    data_type,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'diary_entries' 
AND column_name = 'user_id';

-- Expected result: data_type = 'uuid', udt_name = 'uuid'
-- If data_type = 'text' or 'character varying', that's the problem!

-- 3. Check RLS policies on diary_entries
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'diary_entries';

-- Expected: Should see SELECT, INSERT, UPDATE, DELETE policies

-- 4. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'diary_entries';

-- Expected: rowsecurity = true

-- 5. Test query with your user_id
-- Replace 'd5effed0-3b9f-4708-a428-25035041aa1a' with your actual user_id
SELECT * 
FROM diary_entries 
WHERE user_id = 'd5effed0-3b9f-4708-a428-25035041aa1a'
AND entry_date = '2025-11-07';

-- If this fails, the problem is the data type mismatch

-- 6. If user_id is TEXT instead of UUID, fix it:
-- WARNING: Only run this if step 2 shows data_type = 'text' or 'character varying'

-- First, check if there are any invalid UUIDs
SELECT user_id, entry_date 
FROM diary_entries 
WHERE user_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- If no results, safe to convert:
-- ALTER TABLE diary_entries 
-- ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- 7. Check your auth.users to confirm user exists
SELECT id, email, created_at 
FROM auth.users 
WHERE id = 'd5effed0-3b9f-4708-a428-25035041aa1a';

-- Expected: Should return your user record

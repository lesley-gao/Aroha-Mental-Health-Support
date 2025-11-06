-- =========================================
-- Check RLS Policies
-- =========================================
-- Verify that RLS policies allow the user to see their data
-- =========================================

-- 1. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('phq9_records', 'diary_entries');

-- 2. List all policies on these tables
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
WHERE tablename IN ('phq9_records', 'diary_entries')
ORDER BY tablename, policyname;

-- 3. Test if you can see PHQ-9 data as the authenticated user
-- First, get your current session user_id
SELECT 
  auth.uid() as current_user_id,
  'd5effed0-3b9f-4708-a428-25035041aa1a'::uuid as expected_user_id,
  auth.uid()::text = 'd5effed0-3b9f-4708-a428-25035041aa1a' as ids_match;

-- 4. Test SELECT with RLS (this simulates what the app sees)
SELECT 
  COUNT(*) as phq9_visible_to_current_user
FROM phq9_records
WHERE user_id = auth.uid();

SELECT 
  COUNT(*) as diary_visible_to_current_user
FROM diary_entries
WHERE user_id = auth.uid();

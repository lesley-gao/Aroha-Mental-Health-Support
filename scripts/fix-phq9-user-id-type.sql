-- =========================================
-- Fix PHQ-9 User ID Type Mismatch
-- =========================================
-- The phq9_records table expects user_id as TEXT
-- but we inserted UUID values
-- This converts them to TEXT format
-- =========================================

-- Check current state
SELECT 
  id,
  user_id,
  pg_typeof(user_id) as current_type,
  total,
  created_at::date
FROM phq9_records
LIMIT 3;

-- Fix: Convert all UUID user_id values to TEXT
-- If user_id is already UUID type, cast it to TEXT
UPDATE phq9_records
SET user_id = user_id::text
WHERE pg_typeof(user_id::text) = 'text'::regtype;

-- Verify the fix
SELECT 
  COUNT(*) as total_records,
  user_id,
  pg_typeof(user_id) as type_after_fix
FROM phq9_records
GROUP BY user_id;

-- Test if the app can now see the records
SELECT 
  COUNT(*) as records_for_user
FROM phq9_records
WHERE user_id = 'd5effed0-3b9f-4708-a428-25035041aa1a';

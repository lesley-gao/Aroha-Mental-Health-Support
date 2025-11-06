-- =========================================
-- Debug PHQ-9 Records Issue
-- =========================================
-- Check the data type and content of phq9_records
-- =========================================

-- 1. Check the column types
SELECT 
  table_name,
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name IN ('phq9_records', 'diary_entries')
  AND column_name = 'user_id'
ORDER BY table_name;

-- 2. Check the actual data in phq9_records
SELECT 
  id,
  user_id,
  pg_typeof(user_id) as user_id_type,
  total,
  severity,
  created_at::date
FROM phq9_records
ORDER BY created_at DESC
LIMIT 5;

-- 3. Check if user_id matches the expected format
SELECT 
  user_id,
  user_id::text as user_id_text,
  'd5effed0-3b9f-4708-a428-25035041aa1a' as expected_uuid,
  user_id::text = 'd5effed0-3b9f-4708-a428-25035041aa1a' as matches,
  COUNT(*) as record_count
FROM phq9_records
GROUP BY user_id;

-- 4. Try to see what the app would see (with proper UUID casting)
SELECT 
  COUNT(*) as total_records,
  MIN(created_at::date) as earliest,
  MAX(created_at::date) as latest,
  MIN(total) as min_score,
  MAX(total) as max_score
FROM phq9_records
WHERE user_id = 'd5effed0-3b9f-4708-a428-25035041aa1a'::uuid;

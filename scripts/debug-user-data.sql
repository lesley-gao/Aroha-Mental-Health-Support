-- =========================================
-- Debug User Data
-- =========================================
-- Run this to check what data exists and which user it belongs to
-- =========================================

-- 1. Check all users in auth
SELECT 
  id,
  email,
  created_at,
  confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Check PHQ-9 records and their user_ids
SELECT 
  user_id,
  COUNT(*) as record_count,
  MIN(created_at::date) as earliest,
  MAX(created_at::date) as latest
FROM phq9_records
GROUP BY user_id;

-- 3. Check diary entries and their user_ids
SELECT 
  user_id,
  COUNT(*) as entry_count,
  MIN(entry_date) as earliest,
  MAX(entry_date) as latest
FROM diary_entries
GROUP BY user_id;

-- 4. Match data to users
SELECT 
  u.email,
  u.id::text as user_id,
  (SELECT COUNT(*) FROM phq9_records WHERE user_id::text = u.id::text) as phq9_count,
  (SELECT COUNT(*) FROM diary_entries WHERE user_id::text = u.id::text) as diary_count
FROM auth.users u
ORDER BY u.created_at DESC;

-- 5. Check if the UUID we used matches any user
SELECT 
  'Expected UUID' as source,
  'd5effed0-3b9f-4708-a428-25035041aa1a' as uuid,
  EXISTS(SELECT 1 FROM auth.users WHERE id::text = 'd5effed0-3b9f-4708-a428-25035041aa1a') as user_exists,
  (SELECT email FROM auth.users WHERE id::text = 'd5effed0-3b9f-4708-a428-25035041aa1a') as email,
  (SELECT COUNT(*) FROM phq9_records WHERE user_id::text = 'd5effed0-3b9f-4708-a428-25035041aa1a') as phq9_count,
  (SELECT COUNT(*) FROM diary_entries WHERE user_id::text = 'd5effed0-3b9f-4708-a428-25035041aa1a') as diary_count;

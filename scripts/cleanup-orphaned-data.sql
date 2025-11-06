-- =========================================
-- Cleanup Orphaned Data
-- =========================================
-- Run this after deleting a user to remove any orphaned records
-- This ensures a completely clean slate before creating a new account
-- =========================================

-- Remove diary entries that don't belong to any existing user
DELETE FROM diary_entries 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Remove PHQ-9 records that don't belong to any existing user
DELETE FROM phq9_records 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Show results
SELECT 
  'Cleanup complete!' as status,
  (SELECT COUNT(*) FROM diary_entries) as remaining_diary_entries,
  (SELECT COUNT(*) FROM phq9_records) as remaining_phq9_records;

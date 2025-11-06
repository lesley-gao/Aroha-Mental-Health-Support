-- =========================================
-- Seed Additional PHQ-9 Test Data
-- =========================================
-- This script adds 15 additional PHQ-9 records spanning 6 months
-- to complement the existing 12 records for comprehensive chart testing
--
-- IMPORTANT: Before running this script:
-- 1. Make sure you are LOGGED INTO the app at http://localhost:5174
-- 2. Stay logged in while running this script in Supabase SQL Editor
-- 3. auth.uid() will use your active session to insert data
-- =========================================

-- Insert additional PHQ-9 records (6 months of bi-weekly data)
INSERT INTO phq9_records (user_id, answers, total, severity, created_at) VALUES
  -- Month 1 (180 days ago) - Severe to Moderately Severe
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[3,3,3,3,3,3,3,3,3], 27, 'severe', NOW() - INTERVAL '180 days'),
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[3,3,3,3,3,2,3,2,3], 25, 'severe', NOW() - INTERVAL '173 days'),
  
  -- Month 2 (166-152 days ago) - Moderately Severe
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[3,3,2,3,2,2,3,2,2], 22, 'moderately_severe', NOW() - INTERVAL '166 days'),
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[2,3,2,3,2,2,2,2,2], 20, 'moderately_severe', NOW() - INTERVAL '159 days'),
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[2,2,2,2,3,2,2,2,2], 19, 'moderately_severe', NOW() - INTERVAL '152 days'),
  
  -- Month 3 (145-131 days ago) - Moderately Severe to Moderate
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[2,2,2,2,2,2,2,2,1], 17, 'moderately_severe', NOW() - INTERVAL '145 days'),
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[2,2,1,2,2,2,2,1,1], 15, 'moderate', NOW() - INTERVAL '138 days'),
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[2,1,2,2,1,2,2,1,1], 14, 'moderate', NOW() - INTERVAL '131 days'),
  
  -- Month 4 (124-110 days ago) - Moderate
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[1,2,1,2,2,1,2,1,1], 13, 'moderate', NOW() - INTERVAL '124 days'),
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[1,2,1,1,2,1,2,1,1], 12, 'moderate', NOW() - INTERVAL '117 days'),
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[1,1,1,2,1,1,2,1,1], 11, 'moderate', NOW() - INTERVAL '110 days'),
  
  -- Month 5 (103-89 days ago) - Moderate to Mild
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[1,1,1,1,1,1,2,1,1], 10, 'moderate', NOW() - INTERVAL '103 days'),
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[1,1,1,1,1,1,1,1,1], 9, 'mild', NOW() - INTERVAL '96 days'),
  
  -- Continue with existing data from previous script (84-7 days ago)
  -- Week 1-12 data already exists, creating smooth progression
  
  -- Recent weeks (3-0 days ago) - Minimal scores for current state
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[0,0,0,0,0,0,1,0,0], 1, 'minimal', NOW() - INTERVAL '3 days'),
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[0,0,0,0,0,0,0,0,0], 0, 'minimal', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Verify the complete data set
SELECT 
  COUNT(*) as total_records,
  MIN(created_at::date) as earliest_assessment,
  MAX(created_at::date) as latest_assessment,
  MIN(total) as lowest_score,
  MAX(total) as highest_score,
  ROUND(AVG(total)::numeric, 1) as average_score
FROM phq9_records
WHERE user_id = 'd5effed0-3b9f-4708-a428-25035041aa1a';

-- Show progression over time (most recent 10)
SELECT 
  created_at::date as assessment_date,
  total as score,
  severity,
  ROW_NUMBER() OVER (ORDER BY created_at) as assessment_number
FROM phq9_records
WHERE user_id = 'd5effed0-3b9f-4708-a428-25035041aa1a'
ORDER BY created_at DESC
LIMIT 10;

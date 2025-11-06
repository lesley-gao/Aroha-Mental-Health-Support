-- Seed Test PHQ9 Data for Charts
-- Run this in Supabase SQL Editor while authenticated as your test user
-- This creates 12 weeks of test data showing gradual improvement

-- Insert test PHQ9 records (90 days of data showing improvement trend)
INSERT INTO phq9_records (user_id, answers, total, severity, created_at) VALUES
  -- Week 1 (84 days ago) - Moderately Severe
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[3,3,2,3,2,2,3,2,1], 21, 'moderately_severe', NOW() - INTERVAL '84 days'),
  
  -- Week 2 (77 days ago) - Moderately Severe
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[2,3,2,2,3,2,2,2,1], 19, 'moderately_severe', NOW() - INTERVAL '77 days'),
  
  -- Week 3 (70 days ago) - Moderate
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[2,2,2,2,2,2,2,1,1], 16, 'moderate', NOW() - INTERVAL '70 days'),
  
  -- Week 4 (63 days ago) - Moderate
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[2,2,1,2,2,1,2,1,1], 14, 'moderate', NOW() - INTERVAL '63 days'),
  
  -- Week 5 (56 days ago) - Moderate
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[1,2,2,1,2,1,2,1,1], 13, 'moderate', NOW() - INTERVAL '56 days'),
  
  -- Week 6 (49 days ago) - Moderate
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[1,1,2,1,2,1,1,1,1], 11, 'moderate', NOW() - INTERVAL '49 days'),
  
  -- Week 7 (42 days ago) - Mild
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[1,1,1,1,1,1,1,1,1], 9, 'mild', NOW() - INTERVAL '42 days'),
  
  -- Week 8 (35 days ago) - Mild
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[1,1,1,1,1,0,1,1,1], 8, 'mild', NOW() - INTERVAL '35 days'),
  
  -- Week 9 (28 days ago) - Mild
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[1,0,1,1,1,0,1,0,1], 6, 'mild', NOW() - INTERVAL '28 days'),
  
  -- Week 10 (21 days ago) - Minimal
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[0,1,0,1,0,0,1,0,1], 4, 'minimal', NOW() - INTERVAL '21 days'),
  
  -- Week 11 (14 days ago) - Minimal
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[0,0,1,0,0,0,1,0,1], 3, 'minimal', NOW() - INTERVAL '14 days'),
  
  -- Week 12 (7 days ago) - Minimal
  ('d5effed0-3b9f-4708-a428-25035041aa1a', ARRAY[0,0,0,1,0,0,0,0,1], 2, 'minimal', NOW() - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 
  COUNT(*) as total_records,
  MIN(created_at::date) as earliest_date,
  MAX(created_at::date) as latest_date,
  MIN(total) as min_score,
  MAX(total) as max_score,
  ROUND(AVG(total)::numeric, 1) as avg_score
FROM phq9_records
WHERE user_id = 'd5effed0-3b9f-4708-a428-25035041aa1a';

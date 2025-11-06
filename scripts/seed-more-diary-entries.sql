-- =========================================
-- Seed More Diary Entries for Testing
-- =========================================
-- This script adds 20 additional diary entries spanning 60 days
-- to complement the existing 8 entries for comprehensive testing
--
-- IMPORTANT: Before running this script:
-- 1. Make sure you are LOGGED INTO the app at http://localhost:5174
-- 2. Stay logged in while running this script in Supabase SQL Editor
-- 3. auth.uid() will use your active session to insert data
-- =========================================

-- Insert additional diary entries (60 days of varied content)
INSERT INTO diary_entries (user_id, entry_date, title, content) VALUES
  -- Week 1 (60-53 days ago)
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '60 days', 'Starting My Journey', 
   'Today I decided to really commit to my mental health journey. I know it won''t be easy, but I''m ready to put in the work. Feeling hopeful but also a bit anxious about what lies ahead.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '57 days', 'Rough Morning', 
   'Woke up feeling heavy. It took a lot of effort to get out of bed. But I did it. That''s something.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '54 days', 'Small Victories', 
   'Made my bed, took a shower, and went for a short walk. These might seem small, but they feel huge right now.'),
  
  -- Week 2-3 (53-40 days ago)
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '50 days', 'Therapy Session', 
   'Had my first therapy session. It was intense. Talked about things I haven''t discussed in years. Feeling emotionally drained but also relieved.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '47 days', 'Good Day', 
   'Actually had a good day today! Spent time with friends, laughed a lot. Reminded me that joy is still possible.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '43 days', 'Meditation Practice', 
   'Started a daily meditation practice. 10 minutes feels long, but I''m sticking with it. Noticed my breathing patterns changing.'),
  
  -- Week 4-5 (40-26 days ago)
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '40 days', 'Energy Returning', 
   'Feeling more energy this week. Completed a few tasks that have been on my to-do list for months. Progress!'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '36 days', 'Creative Flow', 
   'Did some painting today. First time in ages. Lost track of time, which felt amazing. Art is healing.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '33 days', 'Sleep Quality Improving', 
   'Slept through the night without waking up. First time in weeks. Feeling rested and clear-headed.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '29 days', 'Social Anxiety', 
   'Went to a social gathering. Felt anxious at first but pushed through. Proud of myself for not backing out.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '26 days', 'Healthy Habits', 
   'Cooking nutritious meals, exercising regularly, journaling daily. These routines are becoming natural now.'),
  
  -- Week 6-7 (25-12 days ago)
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '22 days', 'Setback Day', 
   'Had a tough day. Old thoughts crept back in. But I used my coping strategies and got through it. Tomorrow is a new day.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '19 days', 'Nature Therapy', 
   'Spent the afternoon in the park. Fresh air, sunshine, and bird songs. Nature is powerful medicine.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '17 days', 'Boundary Setting', 
   'Had a difficult conversation and set a boundary. It was uncomfortable but necessary. Learning to prioritize my wellbeing.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '15 days', 'Mindfulness Moment', 
   'Practicing mindfulness throughout the day. Noticing more moments of peace and presence.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '12 days', 'Connection', 
   'Called an old friend. We talked for hours. Reminded me that I''m not alone in this journey.'),
  
  -- Recent entries overlap with existing data (10-0 days ago)
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '8 days', 'Building Momentum', 
   'Feeling stronger every day. The fog is lifting. I can see a future that feels bright and hopeful.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '6 days', 'Work Achievement', 
   'Completed a major project at work. My focus and productivity are back. Feeling accomplished.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '4 days', 'Joy Rediscovered', 
   'Laughed until my stomach hurt today. Pure, genuine joy. It''s been so long. This is what recovery feels like.'),
  
  ('d5effed0-3b9f-4708-a428-25035041aa1a', CURRENT_DATE - INTERVAL '1 day', 'Reflection', 
   'Looking back at where I started and where I am now. The journey has been hard, but I''m so proud of how far I''ve come. Recovery is possible.')
ON CONFLICT (user_id, entry_date) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Verify the complete data set
SELECT 
  COUNT(*) as total_entries,
  MIN(entry_date) as earliest_entry,
  MAX(entry_date) as latest_entry,
  ROUND(AVG(LENGTH(content))::numeric, 0) as avg_content_length
FROM diary_entries
WHERE user_id = 'd5effed0-3b9f-4708-a428-25035041aa1a';

-- Show recent entries
SELECT 
  entry_date,
  title,
  LEFT(content, 50) || '...' as content_preview
FROM diary_entries
WHERE user_id = 'd5effed0-3b9f-4708-a428-25035041aa1a'
ORDER BY entry_date DESC
LIMIT 10;

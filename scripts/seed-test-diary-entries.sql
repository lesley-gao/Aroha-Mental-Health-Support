-- Seed Test Diary Entries
-- Run this in Supabase SQL Editor while authenticated as your test user

-- Insert test diary entries
INSERT INTO diary_entries (user_id, entry_date, title, content) VALUES
  -- Today
  (auth.uid(), CURRENT_DATE, 'Feeling Better Today', 
   'Had a good morning walk. The fresh air really helped clear my mind. Practiced some breathing exercises and felt more centered.'),
  
  -- 2 days ago
  (auth.uid(), CURRENT_DATE - INTERVAL '2 days', 'Challenging Day at Work', 
   'Work was stressful today. Had to deal with a difficult deadline. Remembered to take breaks and that helped. Looking forward to the weekend.'),
  
  -- 5 days ago
  (auth.uid(), CURRENT_DATE - INTERVAL '5 days', 'Gratitude Practice', 
   'Today I am grateful for my supportive friends, a warm home, and the ability to take time for self-care. Small things matter.'),
  
  -- 7 days ago
  (auth.uid(), CURRENT_DATE - INTERVAL '7 days', 'Weekend Reflection', 
   'Spent time with family this weekend. It reminded me how important connection is. Feeling recharged and ready for the week ahead.'),
  
  -- 10 days ago
  (auth.uid(), CURRENT_DATE - INTERVAL '10 days', 'Self-Care Day', 
   'Took the day to focus on myself. Read a book, cooked a healthy meal, and had a long bath. Sometimes rest is the most productive thing.'),
  
  -- 14 days ago
  (auth.uid(), CURRENT_DATE - INTERVAL '14 days', 'Progress Check-In', 
   'Looking back at where I was a few weeks ago, I can see real progress. The tools I''ve been learning are making a difference.'),
  
  -- 21 days ago
  (auth.uid(), CURRENT_DATE - INTERVAL '21 days', 'Nature Walk', 
   'Went for a long walk in the park today. Being in nature always helps me feel more grounded and peaceful.'),
  
  -- 30 days ago
  (auth.uid(), CURRENT_DATE - INTERVAL '30 days', 'Starting This Journey', 
   'Today I decided to start taking my mental health seriously. This diary will help me track my thoughts and progress.')
ON CONFLICT (user_id, entry_date) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Verify the data was inserted
SELECT 
  COUNT(*) as total_entries,
  MIN(entry_date) as earliest_entry,
  MAX(entry_date) as latest_entry
FROM diary_entries
WHERE user_id = auth.uid();

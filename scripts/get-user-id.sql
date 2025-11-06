-- Step 1: Find Your User ID
-- Run this FIRST to get your user_id
-- You must be logged into the app first!

SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
WHERE email = 'lesleygao.it@gmail.com';

-- Copy the user_id (it will look like: 12345678-1234-1234-1234-123456789abc)
-- Then use it in the next scripts

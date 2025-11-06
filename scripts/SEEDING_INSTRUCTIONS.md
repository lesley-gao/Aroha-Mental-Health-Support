# Database Seeding Instructions

## Problem Overview
The `auth.uid()` function in SQL returns `null` when you're not authenticated in the Supabase SQL Editor session. This causes the "null value in column user_id" error when trying to insert data.

## Solution: 3-Step Process

### Step 1: Get Your User UUID

1. Open **Supabase Dashboard** → **SQL Editor**
2. Open and run `scripts/get-user-id.sql`
3. **Copy the UUID** from the results (it looks like: `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

```sql
-- Example result:
-- id: a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6
-- email: lesleygao.it@gmail.com
```

### Step 2: Update PHQ-9 Seeding Script

1. Open `scripts/seed-more-phq9-data.sql`
2. Find line 15: `target_user_id uuid := 'YOUR_USER_ID_HERE';`
3. **Replace** `'YOUR_USER_ID_HERE'` with your UUID from Step 1

**Before:**
```sql
DECLARE
  target_user_id uuid := 'YOUR_USER_ID_HERE'; -- REPLACE THIS
```

**After:**
```sql
DECLARE
  target_user_id uuid := 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'; -- Your actual UUID
```

4. **Save the file**
5. Run the script in Supabase SQL Editor

### Step 3: Update Diary Entries Seeding Script

1. Open `scripts/seed-more-diary-entries.sql`
2. Find line 16: `target_user_id uuid := 'YOUR_USER_ID_HERE';`
3. **Replace** `'YOUR_USER_ID_HERE'` with the SAME UUID from Step 1

**Before:**
```sql
DECLARE
  target_user_id uuid := 'YOUR_USER_ID_HERE'; -- REPLACE THIS
```

**After:**
```sql
DECLARE
  target_user_id uuid := 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'; -- Your actual UUID
```

4. **Save the file**
5. Run the script in Supabase SQL Editor

## Expected Results

### After seed-more-phq9-data.sql:
```
NOTICE: Data inserted successfully!
NOTICE: Total records: 27
NOTICE: Date range: 2024-07-15 to 2025-01-10
NOTICE: Score range: 0 to 27
```

### After seed-more-diary-entries.sql:
```
NOTICE: Data inserted successfully!
NOTICE: Total diary entries: 28
NOTICE: Date range: 2024-11-12 to 2025-01-10
```

## Verification Queries

Run these queries to verify your data:

### Check PHQ-9 Records:
```sql
SELECT 
  created_at::date as date,
  total as score,
  severity
FROM phq9_records
WHERE user_id = 'YOUR_USER_ID_HERE' -- Replace with your UUID
ORDER BY created_at DESC
LIMIT 10;
```

### Check Diary Entries:
```sql
SELECT 
  entry_date,
  title,
  LEFT(content, 50) || '...' as preview
FROM diary_entries
WHERE user_id = 'YOUR_USER_ID_HERE' -- Replace with your UUID
ORDER BY entry_date DESC
LIMIT 10;
```

## Troubleshooting

### Error: "User ID does not exist"
- Double-check the UUID you copied from Step 1
- Ensure you're using the correct email: `lesleygao.it@gmail.com`
- Verify the user exists in your Supabase Auth dashboard

### Error: "Syntax error near $"
- Make sure you copied the ENTIRE script including the `DO $$` and `END $$;` blocks
- Don't modify any SQL syntax, only replace the UUID value

### Error: "Duplicate key value violates unique constraint"
- This means the data already exists
- You can safely ignore this error
- Or, delete existing test data first with:
```sql
DELETE FROM phq9_records WHERE user_id = 'YOUR_USER_ID_HERE';
DELETE FROM diary_entries WHERE user_id = 'YOUR_USER_ID_HERE';
```

## Why This Approach?

The `auth.uid()` function requires an active user session, which only exists when:
- A user is logged into the app
- Making API calls through the authenticated client

When running SQL directly in the Supabase SQL Editor:
- There is no user session
- `auth.uid()` returns `null`
- Direct UUID insertion is required

## Next Steps

After seeding data successfully:
1. **Refresh your app** at http://localhost:5174
2. **Navigate to History** - You should see PHQ-9 charts with 27 data points
3. **Navigate to Diary** - You should see 28 entries in the sidebar
4. **Test the features**:
   - View trends in PHQ-9 charts
   - Click "View Full Entry" on diary items
   - Use Previous/Next navigation
   - Test speech-to-text (Chrome/Edge required)

## Files Reference

- `get-user-id.sql` - Retrieves your user UUID
- `seed-more-phq9-data.sql` - Adds 15 PHQ-9 records (6 months)
- `seed-more-diary-entries.sql` - Adds 20 diary entries (60 days)
- `seed-test-phq9-data.sql` - Original 12 records (also needs UUID update if not run yet)
- `seed-test-diary-entries.sql` - Original 8 entries (also needs UUID update if not run yet)

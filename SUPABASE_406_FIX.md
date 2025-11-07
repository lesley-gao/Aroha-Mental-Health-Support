# Supabase 406 Error Fix

## Problem
Getting `406 Not Acceptable` error when querying `diary_entries` table.

## Root Cause
The `.single()` method in Supabase throws a 406 error when:
1. No rows match the query (expects 1, gets 0)
2. Multiple rows match (expects 1, gets 2+)
3. The API doesn't have the right Accept header

## Fix Applied
Changed `.single()` to `.maybeSingle()` in `loadEntryForDate()` function.

### Before:
```typescript
.single(); // Throws 406 if no row found
```

### After:
```typescript
.maybeSingle(); // Returns null if no row, no error
```

## Test the Fix

1. **Refresh browser** (Ctrl+Shift+R)
2. **Check console** - 406 error should be gone
3. **Navigate to Diary page**
4. **Try creating a new entry** - should work now

## If Still Getting 406 Error

The issue might be RLS (Row Level Security) policies. Let's check:

### Option 1: Verify RLS Policies in Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Policies**
4. Check `diary_entries` table
5. Make sure you have these policies:

**SELECT Policy:**
```sql
CREATE POLICY "Users can view their own diary entries"
ON diary_entries FOR SELECT
USING (auth.uid() = user_id);
```

**INSERT Policy:**
```sql
CREATE POLICY "Users can insert their own diary entries"
ON diary_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**UPDATE Policy:**
```sql
CREATE POLICY "Users can update their own diary entries"
ON diary_entries FOR UPDATE
USING (auth.uid() = user_id);
```

**DELETE Policy:**
```sql
CREATE POLICY "Users can delete their own diary entries"
ON diary_entries FOR DELETE
USING (auth.uid() = user_id);
```

### Option 2: Check Table Schema

Make sure `diary_entries` table has:
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `entry_date` (date)
- `title` (text)
- `content` (text)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Option 3: Check User ID Type Mismatch

The error might be because `user_id` column type doesn't match.

Run this in Supabase SQL Editor:
```sql
-- Check column type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'diary_entries' 
AND column_name = 'user_id';
```

Expected: `data_type = 'uuid'`

If it's `text`, you need to convert it:
```sql
-- Convert user_id from text to uuid
ALTER TABLE diary_entries 
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
```

## Additional Debugging

Add this to see the actual error:

In `src/pages/Diary.tsx`, update error logging:
```typescript
if (error) {
  console.error('Supabase error details:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
  throw error;
}
```

This will show you exactly what Supabase is complaining about.

## Current Status

✅ Fixed: Changed `.single()` to `.maybeSingle()`
⏳ Test: Refresh and try again
❓ If persists: Check RLS policies and user_id column type

---

**Try refreshing the page now and see if the 406 error is gone!**

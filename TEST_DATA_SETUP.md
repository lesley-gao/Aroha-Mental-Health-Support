# Test Data Setup Guide

## ✅ Database Verification
The diary_entries and phq9_records tables exist in your Supabase database.

## 📝 How to Seed Test Data

### Step 1: Log into Your Application
1. Start the development server: `npm run dev`
2. Open the application in your browser
3. Log in with your test account (or sign up if needed)

### Step 2: Seed PHQ-9 Test Data
1. Open Supabase Dashboard: https://app.supabase.com/
2. Navigate to your project: aroha-mvp (xbomrqjlmubclijialcg)
3. Go to: **SQL Editor** → **New Query**
4. Copy and paste the contents of: `scripts/seed-test-phq9-data.sql`
5. Click **Run** (make sure you're logged into the app first!)
6. You should see: "12 records inserted"

### Step 3: Seed Diary Test Data
1. In Supabase SQL Editor, open a new query
2. Copy and paste the contents of: `scripts/seed-test-diary-entries.sql`
3. Click **Run**
4. You should see: "8 records inserted"

## 🎯 What Data Gets Created

### PHQ-9 Records (12 weeks):
- **Week 1-2**: Moderately severe (scores 19-21)
- **Week 3-6**: Moderate (scores 11-16)
- **Week 7-9**: Mild (scores 6-9)
- **Week 10-12**: Minimal (scores 2-4)

This shows a realistic improvement trend over 90 days.

### Diary Entries (8 entries):
- Spans 30 days with various entry types
- Includes reflections, challenges, and gratitude
- Demonstrates different writing styles and lengths

## 🔍 Verify Data Was Seeded

### Check PHQ-9 Records:
```sql
SELECT COUNT(*), MIN(created_at), MAX(created_at) 
FROM phq9_records 
WHERE user_id = auth.uid();
```

### Check Diary Entries:
```sql
SELECT COUNT(*), MIN(entry_date), MAX(entry_date) 
FROM diary_entries 
WHERE user_id = auth.uid();
```

## ⚠️ Important Notes

- You **must** be logged into the application when running these SQL scripts
- The `auth.uid()` function uses your current session to associate data with your user
- If you get "permission denied" errors, make sure you're authenticated in the app
- You can run these scripts multiple times (ON CONFLICT handling prevents duplicates)

## 🧹 Clean Up Test Data (Optional)

If you want to remove test data later:

```sql
-- Remove all PHQ-9 records
DELETE FROM phq9_records WHERE user_id = auth.uid();

-- Remove all diary entries
DELETE FROM diary_entries WHERE user_id = auth.uid();
```

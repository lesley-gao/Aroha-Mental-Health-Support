# Fresh Start - Database Seeding Instructions

## Overview
This guide helps you start fresh with a new user account and populate test data for comprehensive testing of Phase 2 features (PHQ-9 charts, speech-to-text, and diary preview).

## Step 1: Clean Up Existing Account

### Delete the Old User
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find `leslesgao.it@gmail.com` (or your test account)
3. Click the three dots menu → **Delete User**
4. Confirm deletion

### Clean Up Orphaned Data (Optional)
Run this in Supabase SQL Editor to ensure clean slate:

```sql
-- Remove any orphaned data from deleted users
DELETE FROM diary_entries WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM phq9_records WHERE user_id NOT IN (SELECT id FROM auth.users);
```

## Step 2: Create New Account

1. Open your app at **http://localhost:5174**
2. Click **Sign Up**
3. Enter email: `lesleygao.it@gmail.com`
4. Create a new password
5. Complete the consent modal
6. **STAY LOGGED IN** - This is crucial!

## Step 3: Populate Test Data

### Important: Keep the App Open
- The app must stay open at http://localhost:5174
- You must remain logged in
- `auth.uid()` uses your active session to insert data

### Run Scripts in Order

1. **Open Supabase Dashboard** → **SQL Editor**

2. **Run Script 1**: `seed-test-phq9-data.sql`
   - Adds 12 PHQ-9 records (12 weeks)
   - Scores from 21 (moderately_severe) to 2 (minimal)
   - Paste the entire script and click **Run**

3. **Run Script 2**: `seed-test-diary-entries.sql`
   - Adds 8 diary entries (30 days)
   - Various topics showing mental health journey
   - Paste the entire script and click **Run**

4. **Run Script 3**: `seed-more-phq9-data.sql`
   - Adds 15 more PHQ-9 records (6 months)
   - Scores from 27 (severe) to 0 (minimal)
   - Paste the entire script and click **Run**

5. **Run Script 4**: `seed-more-diary-entries.sql`
   - Adds 20 more diary entries (60 days)
   - Complete recovery narrative
   - Paste the entire script and click **Run**

## Step 4: Verify Data

### Check in Supabase SQL Editor

**PHQ-9 Records (should have 27 total):**
```sql
SELECT 
  COUNT(*) as total_records,
  MIN(created_at::date) as earliest,
  MAX(created_at::date) as latest,
  MIN(total) as lowest_score,
  MAX(total) as highest_score
FROM phq9_records
WHERE user_id = auth.uid();
```

**Diary Entries (should have 28 total):**
```sql
SELECT 
  COUNT(*) as total_entries,
  MIN(entry_date) as earliest,
  MAX(entry_date) as latest
FROM diary_entries
WHERE user_id = auth.uid();
```

### Check in the App

1. **Refresh** the app at http://localhost:5174

2. **Navigate to History** page:
   - ✅ Should see PHQ-9 line chart
   - ✅ Should see 3 summary cards (Current Score, Trend, Average Score)
   - ✅ Chart shows 27 data points over 6 months
   - ✅ List shows all 27 assessments below

3. **Navigate to Diary** page:
   - ✅ Should see 28 entries in the sidebar
   - ✅ Click any entry to view/edit
   - ✅ Click "View Full Entry" to open DiaryView page
   - ✅ Test Previous/Next navigation buttons
   - ✅ Test speech-to-text button (Chrome/Edge required)

## Expected Results

### PHQ-9 Data Overview
- **Total Records**: 27
- **Date Range**: ~6 months (180 days to today)
- **Score Range**: 0 (minimal) to 27 (severe)
- **Progression**: Shows improvement over time (severe → minimal)

### Diary Data Overview
- **Total Entries**: 28
- **Date Range**: ~60 days
- **Content**: Complete mental health journey narrative

## Troubleshooting

### Error: "null value in column user_id"
**Solution**: Make sure you're logged into the app. `auth.uid()` requires an active session.
- Keep http://localhost:5174 open
- Stay logged in
- Try running the script again

### Error: "permission denied for table"
**Solution**: RLS policies require authentication
- Verify you're logged in
- Check that the email matches
- Try logging out and back in

### No data appears in the app
**Solution**: 
1. Check if data exists in Supabase SQL Editor (run verification queries above)
2. Hard refresh the app (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for errors (F12)
4. Verify Supabase credentials in `.env.local`

### Duplicate entry errors
**Solution**: Scripts use `ON CONFLICT DO NOTHING` or `DO UPDATE`, so:
- Duplicates are safely ignored
- You can re-run scripts safely
- To start over, delete the user and begin again

## What to Test After Seeding

### PHQ-9 Charts (History Page)
- [ ] Line chart displays with 27 points
- [ ] Chart shows severity reference lines (5, 10, 15, 20)
- [ ] Hover tooltips show date, score, and severity
- [ ] Summary cards show current score, trend, and average
- [ ] Trend indicator shows "Improving" with down arrow
- [ ] Charts are bilingual (English/Te Reo Māori)

### Diary Preview (Diary Page)
- [ ] Sidebar shows all 28 entries
- [ ] Click entry to load in main view
- [ ] "View Full Entry" opens DiaryView page
- [ ] DiaryView shows formatted content
- [ ] Previous/Next buttons work
- [ ] Edit link navigates back to Diary page
- [ ] URL parameters work (?date=YYYY-MM-DD)

### Speech-to-Text (Diary Page)
- [ ] Microphone button appears below textarea
- [ ] Click starts recording (animated red dot)
- [ ] Speak and see text appear in textarea
- [ ] Stop button ends recording
- [ ] Works in Chrome/Edge (shows browser compatibility message in Firefox/Safari)
- [ ] Bilingual UI (English/Te Reo Māori)

### Responsive Design
- [ ] Test on mobile viewport (Chrome DevTools)
- [ ] Charts remain readable
- [ ] Navigation works on small screens
- [ ] Buttons are touch-friendly

## Next Steps

After successful data seeding and verification:

1. **Run E2E Tests** (if configured):
   ```bash
   npm run test:e2e
   ```

2. **Test Browser Compatibility**:
   - Chrome (primary)
   - Edge (speech-to-text support)
   - Safari (limited speech support)
   - Firefox (no speech support, show fallback)

3. **Document Issues**: Create GitHub issues for any bugs found

4. **Optional Enhancements**: Decide on implementing deferred tasks
   - Keyboard shortcuts (Ctrl+Shift+M for recording)
   - Auto-silence detection
   - Delete button in diary preview
   - Arrow key navigation

## Files Reference

All seeding scripts are in `scripts/` directory:
- `seed-test-phq9-data.sql` - Initial 12 PHQ-9 records
- `seed-test-diary-entries.sql` - Initial 8 diary entries  
- `seed-more-phq9-data.sql` - Additional 15 PHQ-9 records
- `seed-more-diary-entries.sql` - Additional 20 diary entries
- `get-user-id.sql` - (Not needed with this approach)

## Why This Approach Works

✅ **No manual UUID replacement** - Uses `auth.uid()` from active session
✅ **Clean slate** - No orphaned data or conflicts
✅ **Simple process** - Just login and run scripts
✅ **Reliable** - Active session ensures `auth.uid()` works correctly
✅ **Fast** - No need to look up and copy UUIDs

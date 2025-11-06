# Quick Start Guide - Testing Phase 2 Enhancements

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Development Server
The server is already running on **http://localhost:5174/**

### Step 2: Seed Test Data
1. Open your browser to **https://app.supabase.com/**
2. Navigate to your project: **aroha-mvp** (xbomrqjlmubclijialcg)
3. Make sure you're **logged into the application** first (http://localhost:5174)
4. Go to **SQL Editor** → **New Query**
5. Copy and paste the contents of:
   - `scripts/seed-test-phq9-data.sql` (for charts)
   - `scripts/seed-test-diary-entries.sql` (for diary preview)
6. Click **Run** for each script

### Step 3: Test the Features

#### 📊 Test PHQ-9 Charts (Phase 1)
1. Navigate to **History** page (http://localhost:5174/history)
2. You should see:
   - **Score Summary** card showing:
     - Current score
     - Trend (Improving/Stable/Worsening)
     - Average score
   - **Line Chart** showing scores over time with severity lines

**Expected Result**: Beautiful charts showing 12 weeks of improving scores from "Moderately Severe" to "Minimal"

---

#### 🎤 Test Speech-to-Text (Phase 2)
1. Navigate to **Diary** page (http://localhost:5174/diary)
2. Look below the text area for the **"Start Recording"** button
3. Click it and grant microphone permission
4. Speak: "This is a test of the speech to text feature"
5. Watch your words appear in the text area!
6. Click **"Stop Recording"**

**Expected Result**: Your spoken words appear in the diary content area

---

#### 📖 Test Diary Preview (Phase 3)
1. Stay on **Diary** page or navigate there
2. Look at the **"Recent Entries"** sidebar on the right
3. Find any entry and click **"View Full Entry"** button
4. You should see:
   - Full entry with title and content
   - Previous/Next navigation buttons
   - Edit button
   - Created/modified timestamps

**Expected Result**: Full-page view of diary entry with navigation

---

## 🎯 Quick Feature Demos

### Demo 1: Complete PHQ-9 Journey (2 min)
```
1. History page → See your score trend
2. Notice the "Improving" indicator (green)
3. Check the average score calculation
4. Hover over chart points for details
```

### Demo 2: Voice-Powered Diary (2 min)
```
1. Diary page → Click "Start Recording"
2. Say: "Today was a good day. I felt productive and happy."
3. Stop recording
4. Click Save Entry
5. View your voice-typed entry!
```

### Demo 3: Diary Navigation (1 min)
```
1. Diary sidebar → Click "View Full Entry"
2. Use Previous/Next to browse entries
3. Click Edit to modify
4. Back to Diary to return
```

---

## 🔍 What to Look For

### ✅ Charts Working Correctly:
- [ ] Line chart shows 12 data points
- [ ] Score summary shows current = 2
- [ ] Trend indicator says "Improving" (green)
- [ ] Average score around 10-11
- [ ] Reference lines at 5, 10, 15, 20

### ✅ Speech-to-Text Working:
- [ ] Microphone button appears
- [ ] Browser asks for permission
- [ ] Speaking creates text
- [ ] Text appends to existing content
- [ ] Stop button works

### ✅ Diary Preview Working:
- [ ] Sidebar shows recent entries
- [ ] "View Full Entry" button on each item
- [ ] Full page loads with entry
- [ ] Previous/Next buttons work
- [ ] Edit button links back correctly

---

## 🐛 Troubleshooting

### "No charts appearing"
**Solution**: Make sure you have 2+ PHQ-9 records. Run the SQL script while logged in.

### "Speech not working"
**Solutions**:
- Use Chrome or Edge (best support)
- Check microphone permission
- Make sure your microphone is working
- Try saying "test" and check for errors in console

### "Diary entries not showing"
**Solution**: 
- Run `seed-test-diary-entries.sql` in Supabase SQL Editor
- Make sure you're logged into the app first
- Check browser console for errors

### "View Full Entry gives 404"
**Solution**: The entry route should be `/diary/YYYY-MM-DD`. Check App.tsx has the route defined.

---

## 🎨 Language Switching

Don't forget to test bilingual support!

1. Go to **Settings** page
2. Click **"Te Reo Māori"** language option
3. Navigate back to History/Diary
4. Verify translations appear correctly

---

## 📱 Mobile Testing

Test responsive design:
1. Open Dev Tools (F12)
2. Click device toolbar icon
3. Select "iPhone 12 Pro" or "iPad"
4. Navigate through features
5. Check everything still works!

---

## ✨ What's New Summary

| Feature | Location | What to Test |
|---------|----------|-------------|
| **PHQ-9 Charts** | History page | Line chart, score summary, trends |
| **Speech-to-Text** | Diary page | Voice recording button, transcription |
| **Diary Preview** | Diary sidebar | View full entry, navigation buttons |

---

## 🎉 You're All Set!

If you can complete all three feature demos above, congratulations! 🎊 
All Phase 2 enhancements are working perfectly.

**Total test time**: ~5-10 minutes

---

## 📞 Need Help?

Check these files for more details:
- `PHASE2_IMPLEMENTATION_COMPLETE.md` - Full technical documentation
- `TEST_DATA_SETUP.md` - Detailed database setup guide
- `plan/phrase2-enhancements-implementation.md` - Original implementation plan
- `spec/Aroha-MVP-phase2-Enhancements.md` - Feature specifications

---

**Happy Testing! 🚀**

# Diary Feature Setup

## Overview
The Diary feature allows users to write and store daily journal entries. Each entry is associated with a specific date and stored securely in Supabase with Row Level Security (RLS) policies.

## Features
- ✅ Date-based entries (one entry per date)
- ✅ Auto-save functionality
- ✅ Recent entries sidebar
- ✅ Character count
- ✅ Bilingual support (English & Te Reo Māori)
- ✅ Secure storage with RLS policies
- ✅ User-specific data isolation

## Database Setup

### 1. Create the diary_entries table

Run the SQL script in your Supabase SQL Editor:

```bash
# Navigate to Supabase Dashboard > SQL Editor
# Copy and paste the contents of supabase-diary-setup.sql
```

Or use the Supabase CLI:

```bash
supabase db push --file supabase-diary-setup.sql
```

### 2. Table Structure

```sql
diary_entries (
  id UUID PRIMARY KEY,
  user_id UUID (FK to auth.users),
  entry_date DATE (UNIQUE per user),
  content TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### 3. RLS Policies

The following policies are automatically created:
- **SELECT**: Users can only view their own entries
- **INSERT**: Users can create their own entries
- **UPDATE**: Users can update their own entries
- **DELETE**: Users can delete their own entries

All policies use `auth.uid() = user_id` for security.

## Component Structure

### Diary.tsx (`src/pages/Diary.tsx`)

Main diary component with:
- Date selector
- Text area for writing
- Character counter
- Save button
- Recent entries sidebar

### Props
```typescript
interface DiaryProps {
  locale: string; // 'en' | 'mi'
}
```

## Usage

### Navigation
Users can access the diary from the main navigation bar:
- Icon: Pencil2Icon (from Radix UI)
- Route: `/diary`
- Label: "Diary" (English) | "Taku Pukapuka" (Te Reo Māori)

### Writing an Entry
1. Select a date (defaults to today)
2. Type in the text area
3. Click "Save Entry" button
4. Entry is automatically saved to Supabase

### Viewing Past Entries
1. Click on any date in the "Recent Entries" sidebar
2. The entry for that date will load in the editor
3. You can edit and re-save

## API Methods

### loadEntries()
Loads all diary entries for the current user, ordered by date (newest first).

### loadEntryForDate(date: string)
Loads a specific entry for the given date. Returns empty string if no entry exists.

### saveEntry()
Saves or updates the current entry using `upsert` (insert or update based on user_id + entry_date).

## Translations

### English
- Title: "My Diary"
- Subtitle: "Record your thoughts and feelings"
- Placeholder: "Write your thoughts here..."
- Save: "Save Entry"
- Saved: "Entry Saved"

### Te Reo Māori
- Title: "Taku Pukapuka"
- Subtitle: "Tuhia ō whakaaro me ō kare-ā-roto"
- Placeholder: "Tuhia ō whakaaro ki konei..."
- Save: "Tiaki Tuhinga"
- Saved: "Kua Tiakina"

## Security

### Authentication Required
The diary feature is only accessible to authenticated users. The app automatically redirects unauthenticated users to the login page.

### Data Isolation
All queries use the authenticated user's ID from `supabase.auth.getUser()`. RLS policies ensure users can only access their own data.

### Data Privacy
- Entries are stored with encryption at rest in Supabase
- Transport security via HTTPS
- No third-party access to diary content

## Testing

### Manual Testing Checklist
1. ✅ User can create a new entry
2. ✅ User can save an entry
3. ✅ User can edit an existing entry
4. ✅ User can view recent entries
5. ✅ User can switch between dates
6. ✅ Character count updates correctly
7. ✅ Save button is disabled when empty
8. ✅ Language switching works correctly
9. ✅ RLS policies prevent cross-user access

### Test Different Scenarios
- Create entry for today
- Create entry for past date
- Edit existing entry
- Switch languages while editing
- Load entry after page refresh
- Multiple entries in different dates

## Future Enhancements

Potential features to add:
- 📝 Rich text formatting
- 🔍 Search functionality
- 🏷️ Tags or categories
- 📊 Word count statistics
- 📤 Export entries (PDF, JSON)
- 🗑️ Delete functionality
- 📅 Calendar view
- 🔒 Entry-level encryption
- 🌙 Mood tracking

## Troubleshooting

### "Failed to save entry"
- Check Supabase connection in browser console
- Verify RLS policies are correctly set
- Ensure user is authenticated

### Entries not loading
- Check browser console for errors
- Verify `diary_entries` table exists
- Check RLS policies allow SELECT

### TypeScript errors
- Run `npm run type-check`
- Restart TypeScript server in VS Code
- Clear `.vite` cache and rebuild

## Related Files

- `src/pages/Diary.tsx` - Main component
- `src/components/ui/textarea.tsx` - Text area component
- `src/App.tsx` - Routing and navigation
- `supabase-diary-setup.sql` - Database schema and policies
- `docs/DIARY_FEATURE.md` - This documentation

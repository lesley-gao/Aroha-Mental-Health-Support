-- Create diary_entries table
CREATE TABLE IF NOT EXISTS public.diary_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, entry_date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON public.diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_entry_date ON public.diary_entries(entry_date DESC);

-- Enable Row Level Security
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for diary_entries
-- Users can only read their own diary entries
CREATE POLICY "Users can view their own diary entries"
  ON public.diary_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own diary entries
CREATE POLICY "Users can create their own diary entries"
  ON public.diary_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own diary entries
CREATE POLICY "Users can update their own diary entries"
  ON public.diary_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own diary entries
CREATE POLICY "Users can delete their own diary entries"
  ON public.diary_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON public.diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

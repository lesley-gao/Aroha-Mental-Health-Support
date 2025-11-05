-- Migration: Add title column to diary_entries table
-- Run this if you already created the diary_entries table without the title column

-- Add title column
ALTER TABLE public.diary_entries 
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- No need to update existing entries - NULL titles will be displayed as empty

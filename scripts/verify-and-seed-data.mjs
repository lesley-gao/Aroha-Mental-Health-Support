import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Verifying database tables...\n');

// Step 1: Verify diary_entries table exists
async function verifyDiaryTable() {
  console.log('1️⃣ Checking diary_entries table...');
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error accessing diary_entries table:', error.message);
    console.log('\n📋 Please run the following SQL in your Supabase SQL Editor:');
    console.log('   File: supabase-diary-setup.sql\n');
    return false;
  }

  console.log('✅ diary_entries table exists');
  return true;
}

// Step 2: Check PHQ9 records table
async function verifyPHQ9Table() {
  console.log('2️⃣ Checking phq9_records table...');
  const { data, error } = await supabase
    .from('phq9_records')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error accessing phq9_records table:', error.message);
    return false;
  }

  console.log('✅ phq9_records table exists');
  return true;
}

// Step 3: Create test PHQ9 data
async function createTestPHQ9Data() {
  console.log('\n3️⃣ Creating test PHQ9 data...');
  
  // Check if we already have data
  const { data: existingData, error: checkError } = await supabase
    .from('phq9_records')
    .select('id')
    .limit(1);

  if (checkError) {
    console.error('❌ Error checking existing data:', checkError.message);
    return;
  }

  if (existingData && existingData.length > 0) {
    console.log('ℹ️  PHQ9 records already exist. Skipping test data creation.');
    
    // Show existing record count
    const { count } = await supabase
      .from('phq9_records')
      .select('*', { count: 'exact', head: true });
    console.log(`   Found ${count} existing PHQ9 records`);
    return;
  }

  // Generate test data for the past 90 days
  const testRecords = [];
  const today = new Date();
  
  // Create varied scores showing improvement over time
  const scoringPatterns = [
    { week: 1, baseScore: 18, variation: 3 }, // Moderate to severe
    { week: 2, baseScore: 16, variation: 2 }, // Moderate
    { week: 3, baseScore: 14, variation: 3 }, // Moderate
    { week: 4, baseScore: 12, variation: 2 }, // Moderate
    { week: 5, baseScore: 10, variation: 2 }, // Moderate
    { week: 6, baseScore: 8, variation: 2 },  // Mild
    { week: 7, baseScore: 7, variation: 2 },  // Mild
    { week: 8, baseScore: 5, variation: 2 },  // Mild
    { week: 9, baseScore: 4, variation: 1 },  // Minimal
    { week: 10, baseScore: 3, variation: 1 }, // Minimal
    { week: 11, baseScore: 2, variation: 1 }, // Minimal
    { week: 12, baseScore: 1, variation: 1 }, // Minimal
  ];

  for (const pattern of scoringPatterns) {
    const daysAgo = (13 - pattern.week) * 7; // Oldest first
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    // Add some randomness to the score
    const randomVariation = Math.floor(Math.random() * pattern.variation) - Math.floor(pattern.variation / 2);
    const totalScore = Math.max(0, Math.min(27, pattern.baseScore + randomVariation));
    
    // Generate realistic answer distribution
    const answers = generateAnswers(totalScore);
    
    // Determine severity
    let severity = 'minimal';
    if (totalScore >= 20) severity = 'severe';
    else if (totalScore >= 15) severity = 'moderately_severe';
    else if (totalScore >= 10) severity = 'moderate';
    else if (totalScore >= 5) severity = 'mild';

    testRecords.push({
      answers,
      total: totalScore,
      severity,
      created_at: date.toISOString(),
    });
  }

  // Insert test records
  const { data, error } = await supabase
    .from('phq9_records')
    .insert(testRecords)
    .select();

  if (error) {
    console.error('❌ Error creating test PHQ9 data:', error.message);
    return;
  }

  console.log(`✅ Created ${testRecords.length} test PHQ9 records`);
  console.log('   Date range:', new Date(testRecords[0].created_at).toLocaleDateString(), 
              'to', new Date(testRecords[testRecords.length - 1].created_at).toLocaleDateString());
}

// Helper function to generate realistic answer patterns
function generateAnswers(targetTotal) {
  const answers = Array(9).fill(0);
  let remaining = targetTotal;
  
  // Distribute the score across 9 questions
  for (let i = 0; i < 9 && remaining > 0; i++) {
    const maxForQuestion = Math.min(3, remaining);
    const value = Math.floor(Math.random() * (maxForQuestion + 1));
    answers[i] = value;
    remaining -= value;
  }
  
  // Distribute any remaining points
  while (remaining > 0) {
    const randomIndex = Math.floor(Math.random() * 9);
    if (answers[randomIndex] < 3) {
      answers[randomIndex]++;
      remaining--;
    }
  }
  
  return answers;
}

// Step 4: Create test diary entries
async function createTestDiaryData() {
  console.log('\n4️⃣ Creating test diary entries...');
  
  // Check if we already have diary entries
  const { data: existingEntries, error: checkError } = await supabase
    .from('diary_entries')
    .select('id')
    .limit(1);

  if (checkError) {
    console.error('❌ Error checking existing diary entries:', checkError.message);
    return;
  }

  if (existingEntries && existingEntries.length > 0) {
    console.log('ℹ️  Diary entries already exist. Skipping test data creation.');
    
    // Show existing entry count
    const { count } = await supabase
      .from('diary_entries')
      .select('*', { count: 'exact', head: true });
    console.log(`   Found ${count} existing diary entries`);
    return;
  }

  // Generate test diary entries
  const diaryEntries = [
    {
      entry_date: getDateDaysAgo(0),
      title: 'Feeling Better Today',
      content: 'Had a good morning walk. The fresh air really helped clear my mind. Practiced some breathing exercises and felt more centered.',
    },
    {
      entry_date: getDateDaysAgo(2),
      title: 'Challenging Day at Work',
      content: 'Work was stressful today. Had to deal with a difficult deadline. Remembered to take breaks and that helped. Looking forward to the weekend.',
    },
    {
      entry_date: getDateDaysAgo(5),
      title: 'Gratitude Practice',
      content: 'Today I am grateful for my supportive friends, a warm home, and the ability to take time for self-care. Small things matter.',
    },
    {
      entry_date: getDateDaysAgo(7),
      title: 'Weekend Reflection',
      content: 'Spent time with family this weekend. It reminded me how important connection is. Feeling recharged and ready for the week ahead.',
    },
    {
      entry_date: getDateDaysAgo(10),
      title: 'Self-Care Day',
      content: 'Took the day to focus on myself. Read a book, cooked a healthy meal, and had a long bath. Sometimes rest is the most productive thing.',
    },
  ];

  const { data, error } = await supabase
    .from('diary_entries')
    .insert(diaryEntries)
    .select();

  if (error) {
    console.error('❌ Error creating test diary entries:', error.message);
    return;
  }

  console.log(`✅ Created ${diaryEntries.length} test diary entries`);
}

function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

// Main execution
async function main() {
  try {
    const diaryTableExists = await verifyDiaryTable();
    const phq9TableExists = await verifyPHQ9Table();

    if (!diaryTableExists) {
      console.log('\n⚠️  Please create the diary_entries table first using supabase-diary-setup.sql');
      process.exit(1);
    }

    if (phq9TableExists) {
      await createTestPHQ9Data();
    }

    if (diaryTableExists) {
      await createTestDiaryData();
    }

    console.log('\n✨ Database verification and seeding complete!\n');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

main();

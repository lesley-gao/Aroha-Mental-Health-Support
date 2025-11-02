#!/usr/bin/env node

/**
 * Quick Supabase Connection Test
 * Run with: node scripts/test-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const envPath = join(__dirname, '..', '.env');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  const parsed = dotenv.parse(envContent);
  Object.assign(process.env, parsed);
} catch (error) {
  console.error('❌ Could not read .env file:', error.message);
  process.exit(1);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🧪 Supabase Connection Test\n');
console.log('=' .repeat(50));

// Check environment variables
if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  console.log('   VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('   VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log('   URL:', supabaseUrl);
console.log('   Key:', supabaseKey.substring(0, 20) + '...\n');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Check if table exists
  console.log('🔍 Test 1: Checking if phq9_records table exists...');
  try {
    const { error } = await supabase
      .from('phq9_records')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Table check failed:', error.message);
      if (error.code === '42P01') {
        console.log('   ⚠️  Table "phq9_records" does not exist');
        console.log('   📚 Please run the SQL setup from docs/SUPABASE_SETUP.md\n');
      }
      testsFailed++;
    } else {
      console.log('✅ Table exists\n');
      testsPassed++;
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message, '\n');
    testsFailed++;
    return;
  }

  // Test 2: Insert test record
  console.log('🔍 Test 2: Testing INSERT permission...');
  const testUserId = 'test_' + Date.now();
  const testRecord = {
    user_id: testUserId,
    answers: [0, 1, 2, 3, 0, 1, 2, 3, 0],
    total: 12,
    severity: 'Moderate',
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('phq9_records')
      .insert(testRecord)
      .select();

    if (error) {
      console.log('❌ Insert failed:', error.message, '\n');
      testsFailed++;
    } else {
      console.log('✅ Can insert records');
      console.log('   Inserted ID:', data[0]?.id, '\n');
      testsPassed++;

      // Test 3: Read test record
      console.log('🔍 Test 3: Testing SELECT permission...');
      try {
        const { data: readData, error: readError } = await supabase
          .from('phq9_records')
          .select('*')
          .eq('user_id', testUserId);

        if (readError) {
          console.log('❌ Select failed:', readError.message, '\n');
          testsFailed++;
        } else {
          console.log('✅ Can read records');
          console.log('   Found', readData.length, 'record(s)\n');
          testsPassed++;
        }
      } catch (error) {
        console.log('❌ Select failed:', error.message, '\n');
        testsFailed++;
      }

      // Test 4: Delete test record (cleanup)
      console.log('🔍 Test 4: Testing DELETE permission...');
      try {
        const { error: deleteError } = await supabase
          .from('phq9_records')
          .delete()
          .eq('user_id', testUserId);

        if (deleteError) {
          console.log('❌ Delete failed:', deleteError.message);
          console.log('   ⚠️  Test record may remain in database\n');
          testsFailed++;
        } else {
          console.log('✅ Can delete records');
          console.log('   Test record cleaned up\n');
          testsPassed++;
        }
      } catch (error) {
        console.log('❌ Delete failed:', error.message, '\n');
        testsFailed++;
      }
    }
  } catch (error) {
    console.log('❌ Insert failed:', error.message, '\n');
    testsFailed++;
  }

  // Summary
  console.log('=' .repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log('=' .repeat(50));

  if (testsFailed === 0) {
    console.log('\n🎉 SUCCESS! Your Supabase integration is working perfectly!');
    console.log('   You can now enable Cloud Sync in Settings → Cloud Sync\n');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED');
    console.log('   Please check the errors above and refer to docs/SUPABASE_SETUP.md\n');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});

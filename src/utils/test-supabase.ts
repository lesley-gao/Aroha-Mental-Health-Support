/**
 * Supabase Connection Test Utility
 * Run this to verify your Supabase configuration is working
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function testSupabaseConnection() {
  const results = {
    configured: false,
    envVarsPresent: false,
    connectionSuccess: false,
    tablesExist: false,
    canInsert: false,
    canRead: false,
    canDelete: false,
    errors: [] as string[],
  };

  // Check 1: Environment variables
  console.log('🔍 Checking environment variables...');
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    results.envVarsPresent = true;
    console.log('✅ Environment variables found');
    console.log('   URL:', supabaseUrl);
    console.log('   Key:', supabaseKey.substring(0, 20) + '...');
  } else {
    results.errors.push('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env file');
    console.log('❌ Environment variables missing');
    return results;
  }

  // Check 2: Supabase configured
  console.log('\n🔍 Checking Supabase client...');
  if (isSupabaseConfigured()) {
    results.configured = true;
    console.log('✅ Supabase client configured');
  } else {
    results.errors.push('Supabase client not configured');
    console.log('❌ Supabase client not configured');
    return results;
  }

  if (!supabase) {
    results.errors.push('Supabase client is null');
    return results;
  }

  // Check 3: Test connection
  console.log('\n🔍 Testing database connection...');
  try {
    const { error } = await supabase
      .from('phq9_records')
      .select('count')
      .limit(1);
    
    if (error) {
      results.errors.push(`Connection error: ${error.message}`);
      console.log('❌ Connection failed:', error.message);
      
      // Check if table doesn't exist
      if (error.message.includes('does not exist') || error.code === '42P01') {
        results.errors.push('Table "phq9_records" does not exist. Run the SQL setup script from docs/SUPABASE_SETUP.md');
        console.log('⚠️  Table does not exist. Please run the SQL setup script.');
      }
      
      // Check if RLS blocks access
      if (error.message.includes('RLS') || error.code === '42501') {
        results.errors.push('Row Level Security may be blocking access');
        console.log('⚠️  RLS policy issue detected');
      }
    } else {
      results.connectionSuccess = true;
      results.tablesExist = true;
      console.log('✅ Database connection successful');
      console.log('✅ Table "phq9_records" exists');
    }
  } catch (error) {
    results.errors.push(`Connection test failed: ${error}`);
    console.log('❌ Connection test failed:', error);
    return results;
  }

  // Check 4: Test INSERT permission
  console.log('\n🔍 Testing INSERT permission...');
  const testRecord = {
    user_id: 'test_user_' + Date.now(),
    answers: [0, 1, 2, 3, 0, 1, 2, 3, 0],
    total: 12,
    severity: 'Moderate',
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase
      .from('phq9_records')
      .insert(testRecord)
      .select();
    
    if (error) {
      results.errors.push(`Insert failed: ${error.message}`);
      console.log('❌ Insert permission failed:', error.message);
    } else {
      results.canInsert = true;
      console.log('✅ Can insert records');
      
      // Check 5: Test SELECT permission
      console.log('\n🔍 Testing SELECT permission...');
      try {
        const { data: readData, error: readError } = await supabase
          .from('phq9_records')
          .select('*')
          .eq('user_id', testRecord.user_id);
        
        if (readError) {
          results.errors.push(`Select failed: ${readError.message}`);
          console.log('❌ Select permission failed:', readError.message);
        } else if (readData && readData.length > 0) {
          results.canRead = true;
          console.log('✅ Can read records');
          console.log('   Found', readData.length, 'test record(s)');
        }
      } catch (error) {
        results.errors.push(`Select test failed: ${error}`);
        console.log('❌ Select test failed:', error);
      }

      // Check 6: Test DELETE permission (cleanup)
      console.log('\n🔍 Testing DELETE permission...');
      try {
        const { error: deleteError } = await supabase
          .from('phq9_records')
          .delete()
          .eq('user_id', testRecord.user_id);
        
        if (deleteError) {
          results.errors.push(`Delete failed: ${deleteError.message}`);
          console.log('❌ Delete permission failed:', deleteError.message);
          console.log('⚠️  Test record may remain in database');
        } else {
          results.canDelete = true;
          console.log('✅ Can delete records');
          console.log('✅ Test record cleaned up');
        }
      } catch (error) {
        results.errors.push(`Delete test failed: ${error}`);
        console.log('❌ Delete test failed:', error);
      }
    }
  } catch (error) {
    results.errors.push(`Insert test failed: ${error}`);
    console.log('❌ Insert test failed:', error);
  }

  // Final summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log('Environment Variables:', results.envVarsPresent ? '✅' : '❌');
  console.log('Supabase Configured:  ', results.configured ? '✅' : '❌');
  console.log('Connection Success:   ', results.connectionSuccess ? '✅' : '❌');
  console.log('Tables Exist:         ', results.tablesExist ? '✅' : '❌');
  console.log('Can Insert:           ', results.canInsert ? '✅' : '❌');
  console.log('Can Read:             ', results.canRead ? '✅' : '❌');
  console.log('Can Delete:           ', results.canDelete ? '✅' : '❌');
  
  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS FOUND:');
    results.errors.forEach((error, i) => {
      console.log(`   ${i + 1}. ${error}`);
    });
  }
  
  const allTestsPassed = results.configured && 
                         results.connectionSuccess && 
                         results.tablesExist && 
                         results.canInsert && 
                         results.canRead && 
                         results.canDelete;
  
  if (allTestsPassed) {
    console.log('\n🎉 ALL TESTS PASSED! Your Supabase integration is working perfectly!');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED. Please check the errors above and refer to docs/SUPABASE_SETUP.md');
  }
  
  return results;
}

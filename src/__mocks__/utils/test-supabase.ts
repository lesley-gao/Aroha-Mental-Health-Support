/**
 * Jest mock for '@/utils/test-supabase'.
 * Keeps tests deterministic and avoids touching `import.meta.env`.
 */
export async function testSupabaseConnection() {
  return {
    configured: false,
    envVarsPresent: false,
    connectionSuccess: false,
    tablesExist: false,
    canInsert: false,
    canRead: false,
    canDelete: false,
    errors: [] as string[],
  };
}

export default { testSupabaseConnection };

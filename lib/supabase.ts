import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log to see if env vars are loaded
console.log('🔍 Supabase Debug:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl,
    keyPrefix: supabaseAnonKey?.substring(0, 20) + '...'
});

// Create a single supabase client for interacting with your database
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

console.log('✅ Supabase client created:', supabase ? 'YES' : 'NO');

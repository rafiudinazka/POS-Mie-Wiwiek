import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing'
  });
  throw new Error(
    'Application configuration error: Missing Supabase credentials. ' +
    'Please check your environment variables.'
  );
}

console.log('Initializing Supabase client...');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase connection status:', event);
});


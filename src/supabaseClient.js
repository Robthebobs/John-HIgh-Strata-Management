import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in .env file
// REACT_APP_SUPABASE_URL
// REACT_APP_SUPABASE_ANON_KEY

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug output for development
console.log('Environment variables check:');
console.log('REACT_APP_SUPABASE_URL defined:', !!supabaseUrl);
console.log('REACT_APP_SUPABASE_ANON_KEY defined:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Please check your environment variables:');
  console.error('REACT_APP_SUPABASE_URL:', supabaseUrl ? 'Defined' : 'Missing');
  console.error('REACT_APP_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Defined' : 'Missing');
  
  // Provide meaningful error for developers
  throw new Error('Supabase credentials missing. Check your .env file and restart the application.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 
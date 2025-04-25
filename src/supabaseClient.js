import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in .env file
// REACT_APP_SUPABASE_URL
// REACT_APP_SUPABASE_ANON_KEY

// Default to demo values if environment variables are missing
// This lets the site at least render in production even without proper config
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://hzudyqceitblqwekrywg.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dWR5cWNlaXRibHF3ZWtyeXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Mzk0NTQsImV4cCI6MjA2MTExNTQ1NH0.ijN-WHURdUJngp9pm1MLN3IZA0dhMR2tuW4xZoAlxcU';

// Debug output for development
console.log('Supabase initialization:');
console.log('REACT_APP_SUPABASE_URL defined:', !!process.env.REACT_APP_SUPABASE_URL);
console.log('REACT_APP_SUPABASE_ANON_KEY defined:', !!process.env.REACT_APP_SUPABASE_ANON_KEY);

// Setup a flag to check if we're using real credentials
export const hasValidSupabaseCredentials = 
  !!process.env.REACT_APP_SUPABASE_URL && 
  !!process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create client even with placeholder values
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to wrap Supabase calls with error handling
export const safeSupabaseCall = async (operation) => {
  if (!hasValidSupabaseCredentials) {
    console.warn('Supabase operation attempted without valid credentials');
    return { data: null, error: new Error('Supabase credentials not configured') };
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return { data: null, error };
  }
};

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

export default supabase; 
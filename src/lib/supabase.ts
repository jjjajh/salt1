import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Only create client if we have real values, otherwise create a mock
export const supabase = (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder-key') 
  ? null 
  : createClient(supabaseUrl, supabaseKey);
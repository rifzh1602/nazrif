import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

console.log('URL =', supabaseUrl);
console.log('KEY ADA =', !!supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
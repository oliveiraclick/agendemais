
import { createClient } from '@supabase/supabase-js';

// TODO: Revert to environment variables once Vite env loading is fixed
// Temporarily hardcoded due to import.meta.env issues during development
const supabaseUrl = 'https://hieynfhbgzwfldbckgpk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZXluZmhiZ3p3ZmxkYmNrZ3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDE3MDAsImV4cCI6MjA4MDAxNzcwMH0.YDSAu_3_JONlaQxahVZBBVlP4tYaj-9cdU2NhnGv7ig';

// Cria o cliente apenas se as chaves existirem
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

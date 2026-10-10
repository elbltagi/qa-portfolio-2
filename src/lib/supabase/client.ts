import { createClient } from '@supabase/supabase-js';

// Project default credentials for DEPI Automation Test Store Supabase instance
const DEFAULT_SUPABASE_URL = 'https://pjfrjjdbuflnxmvaxvha.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZnJqamRidWZsbnhtdmF4dmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1Nzg1NTksImV4cCI6MjEwNzE1NDU1OX0.j_W_wgxFLLGhElx78aihAxDx1lNtSMH4f-7UoF7AFM8';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_SUPABASE_KEY;

// Create a singleton Supabase client using client-safe public anon keys
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// 1. In Supabase: Project Settings > API
// 2. Paste your Project URL and the "anon public" key below (the anon key is safe to expose;
//    Row Level Security in schema.sql is what protects each user's data).
// NEVER paste the "service_role" key here.
const SUPABASE_URL = 'PASTE_YOUR_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'PASTE_YOUR_ANON_PUBLIC_KEY_HERE';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

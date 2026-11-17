// 1. In Supabase: Project Settings > API
// 2. Paste your Project URL and the "anon public" key below (the anon key is safe to expose;
//    Row Level Security in schema.sql is what protects each user's data).
// NEVER paste the "service_role" key here.
const SUPABASE_URL = 'https://vvpiybbfnufvpeeyekft.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rgo-GRdweWuBuxbRjbv4OQ_RazUbQRx';


const sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.sb = sb;

console.log("SUCCESS: Supabase config.js loaded!");
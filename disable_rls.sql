-- ============================================
-- DISABLE RLS SCRIPT
-- ============================================
-- Run this in Supabase Dashboard > SQL Editor
-- to temporarily disable Row Level Security
-- and allow all operations.

ALTER TABLE salons DISABLE ROW LEVEL SECURITY;

-- If you have other tables with RLS enabled, add them here:
-- ALTER TABLE professionals DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- To verify RLS status:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

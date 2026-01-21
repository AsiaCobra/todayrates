-- Run this SQL in your Supabase Dashboard SQL Editor
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

-- =============================================
-- CREATE CONTACTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update contacts" ON contacts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete contacts" ON contacts
  FOR DELETE USING (auth.role() = 'authenticated');

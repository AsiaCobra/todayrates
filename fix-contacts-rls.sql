-- Run this SQL in your Supabase Dashboard SQL Editor
-- This will update the contacts table RLS policies to be more secure

-- =============================================
-- FIX CONTACTS TABLE RLS POLICIES
-- =============================================

-- Drop the insecure policy
DROP POLICY IF EXISTS "Anyone can insert contacts" ON contacts;

-- Create a more secure INSERT policy with validation
-- This allows public inserts but with basic validation constraints
CREATE POLICY "Public can submit contacts with validation" ON contacts
  FOR INSERT 
  WITH CHECK (
    -- Ensure required fields are not empty
    length(trim(name)) > 0 
    AND length(trim(email)) > 0 
    AND length(trim(subject)) > 0 
    AND length(trim(message)) > 0
    -- Ensure reasonable field lengths
    AND length(name) <= 100
    AND length(email) <= 255
    AND length(subject) <= 200
    AND length(message) <= 2000
    -- Ensure email format is reasonable (basic check)
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    -- Status should always be 'unread' for new submissions
    AND (status IS NULL OR status = 'unread')
  );

-- Update existing policies to be more explicit
DROP POLICY IF EXISTS "Admins can view contacts" ON contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON contacts;
DROP POLICY IF EXISTS "Admins can delete contacts" ON contacts;

-- Only authenticated users can view contacts
CREATE POLICY "Authenticated users can view contacts" ON contacts
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Only authenticated users can update contacts
CREATE POLICY "Authenticated users can update contacts" ON contacts
  FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can delete contacts
CREATE POLICY "Authenticated users can delete contacts" ON contacts
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- =============================================
-- OPTIONAL: ADD RATE LIMITING (Recommended)
-- =============================================

-- Create a function to track contact submissions by IP
-- This helps prevent spam and abuse

-- Create a table to track submission attempts (optional but recommended)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on submissions table
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only system can insert tracking records
CREATE POLICY "System can insert submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_ip_time 
  ON contact_submissions(ip_address, submitted_at);

-- Note: You'll need to implement rate limiting in your application code
-- Example: Check if IP has submitted more than 5 times in last hour
-- before allowing new submissions

-- =============================================
-- VERIFICATION
-- =============================================

-- View all policies on contacts table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'contacts';

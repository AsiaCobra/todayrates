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

-- Add constraints for data validation
ALTER TABLE contacts
  ADD CONSTRAINT check_name_length CHECK (length(trim(name)) > 0 AND length(name) <= 100),
  ADD CONSTRAINT check_email_length CHECK (length(trim(email)) > 0 AND length(email) <= 255),
  ADD CONSTRAINT check_subject_length CHECK (length(trim(subject)) > 0 AND length(subject) <= 200),
  ADD CONSTRAINT check_message_length CHECK (length(trim(message)) > 0 AND length(message) <= 2000),
  ADD CONSTRAINT check_status_values CHECK (status IN ('unread', 'read', 'archived'));

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Secure INSERT policy with validation
-- Allows public to submit contacts but validates input
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
    -- Basic email format validation
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    -- Status must be unread for new submissions
    AND (status IS NULL OR status = 'unread')
  );

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
-- SECURITY NOTES
-- =============================================
-- 1. This allows public contact form submissions (common use case)
-- 2. Input is validated at the database level
-- 3. Only authenticated users can read/modify contacts
-- 4. Consider implementing rate limiting in your application code
-- 5. Consider adding CAPTCHA for additional protection against spam


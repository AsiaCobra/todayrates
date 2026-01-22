# Security Fix: Contacts Table RLS Policy

## Issue
The contacts table had an overly permissive RLS policy:
```sql
CREATE POLICY "Anyone can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);
```

This allowed unrestricted INSERT access, which could be exploited for:
- Spam submissions
- Database flooding
- Malicious data injection
- No input validation

## Solution

### 1. Updated RLS Policy
Replaced the insecure policy with a validated one:

```sql
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
```

### 2. Added Database Constraints
```sql
ALTER TABLE contacts
  ADD CONSTRAINT check_name_length CHECK (length(trim(name)) > 0 AND length(name) <= 100),
  ADD CONSTRAINT check_email_length CHECK (length(trim(email)) > 0 AND length(email) <= 255),
  ADD CONSTRAINT check_subject_length CHECK (length(trim(subject)) > 0 AND length(subject) <= 200),
  ADD CONSTRAINT check_message_length CHECK (length(trim(message)) > 0 AND length(message) <= 2000),
  ADD CONSTRAINT check_status_values CHECK (status IN ('unread', 'read', 'archived'));
```

## How to Apply

### Option 1: Fix Existing Table
Run the SQL file to fix your existing contacts table:
```bash
# In Supabase Dashboard > SQL Editor
# Run: fix-contacts-rls.sql
```

### Option 2: Recreate Table (for new projects)
Use the updated `create-contacts-table.sql` file.

## Security Improvements

✅ **Input Validation**
- Required fields must not be empty
- Field length limits prevent oversized data
- Email format validation (basic regex)

✅ **Status Protection**
- New submissions must have 'unread' status
- Prevents manipulation of contact status

✅ **Database Constraints**
- Enforced at database level
- Cannot be bypassed by application code

## Additional Recommendations

### 1. Rate Limiting (Application Level)
Implement rate limiting in your frontend/backend:

```javascript
// Example: Limit to 5 submissions per hour per IP
const rateLimitKey = `contact:${ipAddress}`;
const submissionCount = await redis.incr(rateLimitKey);
if (submissionCount === 1) {
  await redis.expire(rateLimitKey, 3600); // 1 hour
}
if (submissionCount > 5) {
  throw new Error('Too many submissions. Please try again later.');
}
```

### 2. CAPTCHA Integration
Add Google reCAPTCHA or hCaptcha to your contact form:
- Prevents automated bot submissions
- Reduces spam significantly
- Easy to integrate

### 3. Email Verification (Optional)
Send a verification email before saving to database:
- Confirms email is valid
- Reduces fake submissions
- Better data quality

### 4. Content Filtering
Check for spam/malicious content:
- Block common spam keywords
- Check for SQL injection attempts
- Sanitize HTML/scripts

## Verification

After applying the fix, verify the policies:

```sql
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
```

You should see:
- ✅ `Public can submit contacts with validation` (INSERT)
- ✅ `Authenticated users can view contacts` (SELECT)
- ✅ `Authenticated users can update contacts` (UPDATE)
- ✅ `Authenticated users can delete contacts` (DELETE)

## Impact

### Before
- 🔴 Anyone could insert unlimited contacts
- 🔴 No validation or constraints
- 🔴 Vulnerable to spam/abuse
- 🔴 Database could be flooded

### After
- ✅ Input validated at database level
- ✅ Field length limits enforced
- ✅ Email format checked
- ✅ Status protected
- ✅ Still allows public contact form (intentional)
- ✅ Admin access properly restricted

## Notes

- **Public contact form is intentional** - Users should be able to submit contacts without authentication
- **The fix adds validation** - Not authentication requirements
- **Consider additional layers** - Rate limiting, CAPTCHA for production
- **Monitor submissions** - Watch for patterns of abuse

## Files Updated

1. `create-contacts-table.sql` - Updated with secure policies and constraints
2. `fix-contacts-rls.sql` - Migration script for existing tables
3. `SECURITY-FIX-CONTACTS.md` - This documentation

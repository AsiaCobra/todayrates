# Quick Start: Staging & Production Setup

## 📋 Prerequisites

- [ ] Existing production Supabase project running
- [ ] GitHub repository with working deployment
- [ ] Access to Supabase dashboard

## 🚀 Quick Setup (5 Steps)

### Step 1: Create Staging Supabase Project (5 min)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - Name: `todayrates-staging`
   - Region: Same as production
   - Password: Strong password (save it!)
4. Wait 2 minutes for project creation

### Step 2: Copy Database Schema (3 min)

In Staging Project > SQL Editor, run these scripts:

```sql
-- 1. Create contacts table
-- Copy/paste from: create-contacts-table.sql

-- 2. Create exchange_rates table
CREATE TABLE exchange_rates (
  id BIGSERIAL PRIMARY KEY,
  currency_from TEXT NOT NULL,
  currency_to TEXT NOT NULL,
  buying_rate DECIMAL(18, 10) NOT NULL,
  selling_rate DECIMAL(18, 10) NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Enable RLS
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read rates" ON exchange_rates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert" ON exchange_rates FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update" ON exchange_rates FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete" ON exchange_rates FOR DELETE USING (auth.uid() IS NOT NULL);

-- 3. Create gold_prices table
CREATE TABLE gold_prices (
  id BIGSERIAL PRIMARY KEY,
  gold_type TEXT NOT NULL,
  unit TEXT NOT NULL,
  price DECIMAL(18, 10),
  buying_price DECIMAL(18, 10),
  selling_price DECIMAL(18, 10),
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Enable RLS
ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;

-- Create policies (same as exchange_rates)
CREATE POLICY "Anyone can read gold prices" ON gold_prices FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert" ON gold_prices FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update" ON gold_prices FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete" ON gold_prices FOR DELETE USING (auth.uid() IS NOT NULL);
```

### Step 3: Get Staging Credentials (2 min)

1. In Staging Project, go to: **Settings → API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   Anon key: eyJhbGciOiJI...
   ```

### Step 4: Configure .env.staging (1 min)

Open `.env.staging` and update:

```bash
VITE_SUPABASE_URL=https://your-staging-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=paste_your_staging_anon_key_here

VITE_HISTORY_PER_PAGE=10
VITE_APP_ENV=staging

# Optional: If you need seeding
SUPABASE_SERVICE_ROLE_KEY=paste_staging_service_role_key
```

### Step 5: Test Staging Build (1 min)

```bash
# Build staging version
npm run build:staging

# Check dist folder contains compiled files
ls dist/

# Deploy to staging (if you have separate repo)
# OR just test locally:
npm run preview
```

## ✅ Verification

After setup, verify:

- [ ] Staging project created in Supabase
- [ ] All tables exist with RLS policies
- [ ] `.env.staging` has correct credentials
- [ ] Build succeeds: `npm run build:staging`
- [ ] Yellow "STAGING" badge shows in top-right corner
- [ ] Can login to admin (create test user in Supabase Auth)

## 🎯 Usage

### Development (Local)
```bash
npm run dev
# Uses: .env
# Shows: Blue "DEVELOPMENT" badge
```

### Staging (Test Before Production)
```bash
npm run build:staging
npm run deploy:staging
# Uses: .env.staging
# Shows: Yellow "STAGING" badge
```

### Production (Live Site)
```bash
npm run build:production
npm run deploy
# Uses: .env.production
# Shows: No badge (clean)
```

## 🔄 Typical Workflow

```
1. Develop feature locally (npm run dev)
   ↓
2. Test in development
   ↓
3. Build for staging (npm run build:staging)
   ↓
4. Deploy to staging and test
   ↓
5. If OK, build for production (npm run build:production)
   ↓
6. Deploy to production (npm run deploy)
```

## 📚 Full Documentation

See `DEPLOYMENT.md` for:
- Detailed deployment workflows
- Database migration procedures
- GitHub Actions setup
- Security best practices
- Troubleshooting guide

## 🆘 Quick Troubleshooting

### Build fails?
```bash
# Check environment file
cat .env.staging

# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build:staging
```

### Wrong environment showing?
```bash
# Check VITE_APP_ENV in your .env file
# Rebuild with correct command:
npm run build:staging  # For staging
npm run build:production  # For production
```

### Can't login?
```bash
# Create test user in Supabase:
# Go to: Staging Project → Authentication → Users
# Click "Add user" → Create with email/password
```

## 🎉 You're Done!

You now have:
- ✅ Separate staging environment
- ✅ Visual environment indicators
- ✅ Environment-specific builds
- ✅ Safe testing before production

**Next:** Create a test user and try adding some rates in staging!

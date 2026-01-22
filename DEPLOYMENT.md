# Deployment Guide

## Overview

This project supports multiple environments:
- **Development**: Local development with hot reload
- **Staging**: Testing environment before production
- **Production**: Live site for end users

## Environment Setup

### 1. Environment Files

The project uses environment files to manage configuration:

```
.env               # Local development (gitignored)
.env.staging       # Staging environment (gitignored)  
.env.production    # Production environment (gitignored)
.env.example       # Template for environment variables
```

### 2. Create Staging Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Project settings:
   - **Name**: `todayrates-staging`
   - **Region**: Same as production (for consistency)
   - **Database Password**: Strong password (save securely)
4. Wait for project to be ready (~2 minutes)

### 3. Set Up Staging Database

Once the staging project is created:

1. **Run SQL scripts** in this order (SQL Editor):
   ```sql
   -- 1. Create tables and RLS policies
   -- Run: create-contacts-table.sql
   
   -- 2. Create other tables
   -- Run any other table setup scripts
   
   -- 3. Apply security fixes
   -- Run: fix-contacts-rls.sql
   ```

2. **Optional: Add test data**
   ```bash
   # Update .env.staging with staging credentials
   # Then run seed script
   npm run seed
   ```

### 4. Configure Environment Variables

#### Get Staging Credentials

1. Go to Supabase Dashboard > Your Staging Project
2. Click **Settings** → **API**
3. Copy the following:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJI...`
   - **Service Role Key**: `eyJhbGciOiJI...` (keep secret!)

#### Update .env.staging

```bash
# Open .env.staging and fill in:
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_staging_anon_key_here

# Environment indicator
VITE_APP_ENV=staging

# Optional: For seeding/migrations
SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key
```

## Building for Different Environments

### Development
```bash
npm run dev
# Reads .env file
# Shows "DEVELOPMENT" badge
# Uses local Supabase project
```

### Staging Build
```bash
npm run build:staging
# Reads .env.staging file
# Shows "STAGING" badge (yellow)
# Uses staging Supabase project
```

### Production Build
```bash
npm run build:production
# Reads .env.production file
# No environment badge shown
# Uses production Supabase project
```

## Deployment Workflow

### Option 1: Manual Deployment

#### Deploy to Staging
```bash
# 1. Build staging version
npm run build:staging

# 2. Deploy to staging site
npm run deploy:staging
```

#### Deploy to Production
```bash
# 1. Build production version
npm run build:production

# 2. Deploy to production
npm run deploy
```

### Option 2: Separate Repositories (Recommended)

#### Staging Repository
```bash
# Create new repo: todayrates-staging
git clone https://github.com/yourusername/todayrates-staging.git
cd todayrates-staging

# Copy code from main repo
# Update .env with staging credentials

# Deploy
npm run deploy
```

#### Production Repository
```bash
# Main repo: todayrates
# Deploy normally
npm run deploy
```

### Option 3: GitHub Actions (Advanced)

Create `.github/workflows/deploy-staging.yml`:

```yaml
name: Deploy Staging

on:
  push:
    branches: [ staging ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build with staging config
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL_STAGING }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY_STAGING }}
          VITE_APP_ENV: staging
        run: npm run build:staging
        
      - name: Deploy to GitHub Pages
        run: npm run deploy
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Environment Indicators

### Visual Badges

The app shows environment badges for non-production environments:

- **Development**: Blue badge (top-right)
- **Staging**: Yellow badge (top-right)
- **Production**: No badge (clean look)

### Console Logging

In development mode, the console shows:
```
🔧 Environment: development
🔗 Supabase URL: https://xxxxx.supabase.co
```

## Database Migrations

### Safe Migration Process

1. **Create Migration Script**
   ```sql
   -- scripts/migrations/2026-01-22-add-new-field.sql
   ALTER TABLE exchange_rates ADD COLUMN new_field TEXT;
   ```

2. **Test in Staging**
   - Run SQL in staging Supabase project
   - Test the application thoroughly
   - Verify data integrity

3. **Apply to Production**
   - After successful staging test
   - Run same SQL in production
   - Monitor for errors

4. **Commit Migration Script**
   ```bash
   git add scripts/migrations/
   git commit -m "Migration: Add new field"
   ```

### Rollback Plan

Always have a rollback script ready:
```sql
-- scripts/migrations/2026-01-22-add-new-field-rollback.sql
ALTER TABLE exchange_rates DROP COLUMN new_field;
```

## Testing Checklist

### Before Deploying to Staging
- [ ] All features work in development
- [ ] No console errors
- [ ] Build succeeds (`npm run build:staging`)
- [ ] Environment variables configured

### Before Deploying to Production
- [ ] All features tested in staging
- [ ] Database migrations applied
- [ ] No breaking changes
- [ ] Environment badge not showing
- [ ] Performance tested
- [ ] SEO meta tags correct

## Troubleshooting

### Build Fails
```bash
# Check environment variables
cat .env.staging

# Validate configuration
npm run dev
# Check console for config errors
```

### Wrong Environment Showing
```bash
# Check .env file has correct VITE_APP_ENV
# Rebuild:
npm run build:staging
# OR
npm run build:production
```

### Database Connection Errors
```bash
# Verify Supabase credentials
# Check .env.staging or .env.production
# Ensure URL and Keys are correct
```

### Deployment Fails
```bash
# Clear cache
rm -rf dist node_modules
npm install
npm run build:production
npm run deploy
```

## Security Best Practices

### ✅ DO
- Keep service role keys secret
- Use separate databases for staging/production
- Never commit `.env` files
- Test migrations in staging first
- Use strong database passwords
- Enable RLS policies
- Validate user inputs

### ❌ DON'T
- Don't use production data in staging
- Don't share service role keys
- Don't skip testing in staging
- Don't auto-migrate production
- Don't commit sensitive credentials

## Quick Commands Reference

```bash
# Development
npm run dev                    # Start dev server

# Building
npm run build                  # Default build
npm run build:staging          # Build for staging
npm run build:production       # Build for production

# Deployment
npm run deploy                 # Deploy production
npm run deploy:staging         # Deploy staging

# Database
npm run migrate                # Run migrations
npm run seed                   # Seed database
npm run db:setup              # Setup everything
```

## Support

For issues or questions:
- Check console for error messages
- Verify environment configuration
- Review Supabase dashboard logs
- Check GitHub Actions logs (if using CI/CD)

## Environment URLs

- **Production**: https://asiacobra.github.io/todayrates/
- **Staging**: https://asiacobra.github.io/todayrates-staging/ (if separate repo)
- **Local**: http://localhost:5173

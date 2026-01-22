# Production Data Cleanup Guide

## Overview

This guide helps you safely remove seed/test data from your production database.

## ⚠️ Important Warnings

- **Data will be permanently deleted**
- **Always backup first** (or test in staging)
- **This cannot be easily undone**
- **Plan for downtime** if users are actively viewing data

## Quick Steps

### Step 1: Backup (Optional but Recommended)

```sql
-- Run in Supabase SQL Editor
-- File: scripts/backup-production-data.sql

CREATE TABLE exchange_rates_backup AS 
SELECT * FROM exchange_rates;

CREATE TABLE gold_prices_backup AS 
SELECT * FROM gold_prices;
```

### Step 2: Clear Data

```sql
-- Run in Supabase SQL Editor
-- File: scripts/clear-production-data.sql

DELETE FROM exchange_rates;
DELETE FROM gold_prices;
```

### Step 3: Verify

```sql
-- Check counts (should be 0)
SELECT COUNT(*) FROM exchange_rates;
SELECT COUNT(*) FROM gold_prices;
```

### Step 4: Add Fresh Data

Use your admin panel:
1. Go to https://asiacobra.github.io/todayrates/admin
2. Login with your credentials
3. Click "Auto Generate Exchange Rates & Gold Price"
4. Or use "Add Multiple Rates" / "Add Multiple Prices"

## Detailed Instructions

### Option A: Complete Wipe (Recommended)

**What it does:** Removes all rates and prices

**SQL Script:** `scripts/clear-production-data.sql`

```bash
# 1. Go to Supabase Dashboard
# 2. Open your project
# 3. Go to SQL Editor
# 4. Click "New query"
# 5. Copy/paste clear-production-data.sql
# 6. Review the script
# 7. Click "Run"
```

**Expected Output:**
```
BEFORE DELETION
Exchange Rates: 1523
Gold Prices: 456

AFTER DELETION
Exchange Rates: 0
Gold Prices: 0
```

### Option B: With Backup (Safer)

**What it does:** Creates backup before deletion

```bash
# 1. Run backup script first
# Copy/paste: scripts/backup-production-data.sql
# Click "Run"

# 2. Verify backup created
SELECT COUNT(*) FROM exchange_rates_backup;
SELECT COUNT(*) FROM gold_prices_backup;

# 3. Then run clear script
# Copy/paste: scripts/clear-production-data.sql
# Click "Run"

# 4. If you need to restore:
INSERT INTO exchange_rates SELECT * FROM exchange_rates_backup;
INSERT INTO gold_prices SELECT * FROM gold_prices_backup;
```

### Option C: Selective Cleanup

**What it does:** Removes only specific data

**SQL Script:** `scripts/selective-cleanup.sql`

**Examples:**

```sql
-- Remove old data (keep recent)
DELETE FROM exchange_rates WHERE date < '2026-01-01';
DELETE FROM gold_prices WHERE date < '2026-01-01';

-- Remove test entries
DELETE FROM exchange_rates WHERE updated_by = 'seed_script';
DELETE FROM gold_prices WHERE updated_by = 'seed_script';

-- Keep only last 7 days
DELETE FROM exchange_rates WHERE created_at < NOW() - INTERVAL '7 days';
DELETE FROM gold_prices WHERE created_at < NOW() - INTERVAL '7 days';
```

## What Gets Preserved

✅ **KEPT:**
- Table structures
- RLS policies
- Indexes
- Relationships
- Admin users
- Contacts (if any)

❌ **DELETED:**
- All exchange rates
- All gold prices
- Historical data

## After Cleanup

### 1. Add Fresh Production Data

**Option A: Auto-Generate**
1. Login to admin: https://asiacobra.github.io/todayrates/admin
2. Click "Auto Generate Exchange Rates & Gold Price"
3. Wait for confirmation
4. Verify data appears on homepage

**Option B: Manual Entry**
1. Use "Add Multiple Rates" button
2. Fill in current rates
3. Submit
4. Repeat for gold prices

**Option C: API Import (if available)**
```bash
npm run seed  # If you have updated seed data
```

### 2. Verify Website

- Check homepage shows new data
- Check currency page loads
- Check gold page loads
- Check admin can view/edit data

## Troubleshooting

### Backup Failed
```sql
-- Check if backup tables already exist
SELECT * FROM pg_tables WHERE tablename LIKE '%backup%';

-- Drop old backups first
DROP TABLE IF EXISTS exchange_rates_backup;
DROP TABLE IF EXISTS gold_prices_backup;

-- Then create new backups
```

### Deletion Failed (Permission Denied)
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'exchange_rates';

-- Make sure you're authenticated admin
-- Or temporarily disable RLS:
ALTER TABLE exchange_rates DISABLE ROW LEVEL SECURITY;
DELETE FROM exchange_rates;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
```

### Accidentally Deleted Wrong Data
```sql
-- Restore from backup (if you created one)
INSERT INTO exchange_rates 
SELECT * FROM exchange_rates_backup;

INSERT INTO gold_prices 
SELECT * FROM gold_prices_backup;
```

### Website Shows Empty
- This is expected after cleanup
- Add new data via admin panel
- Or run auto-generate feature

## Best Practices

### For Production
1. ✅ Test in staging first
2. ✅ Create backup before deletion
3. ✅ Run during low-traffic hours
4. ✅ Notify users of maintenance (if applicable)
5. ✅ Verify restore process works
6. ✅ Have fresh data ready to add

### For Staging
1. Can delete without backup
2. Good place to test cleanup scripts
3. Practice restore procedures

## Maintenance Schedule

Consider scheduling regular cleanups:

```sql
-- Weekly: Remove data older than 90 days
DELETE FROM exchange_rates 
WHERE created_at < NOW() - INTERVAL '90 days';

DELETE FROM gold_prices 
WHERE created_at < NOW() - INTERVAL '90 days';
```

## SQL Scripts Reference

| Script | Purpose | Safety |
|--------|---------|--------|
| `backup-production-data.sql` | Create backups | Safe |
| `clear-production-data.sql` | Delete all data | ⚠️ Destructive |
| `selective-cleanup.sql` | Delete specific data | ⚠️ Careful |

## Recovery Plan

If something goes wrong:

1. **Have backup?** → Restore from backup tables
2. **No backup?** → Use admin panel to re-add data
3. **Critical?** → Contact Supabase support for point-in-time recovery

## Quick Command Reference

```bash
# Test in staging first
npm run build:staging
# Verify staging database

# Production cleanup
# 1. Backup (SQL Editor)
# 2. Clear (SQL Editor)  
# 3. Verify (SQL Editor)
# 4. Add fresh data (Admin panel)
```

## Checklist

Before running cleanup:
- [ ] Tested in staging environment
- [ ] Created backup (or decided not to)
- [ ] Notified users (if applicable)
- [ ] Scheduled during low traffic
- [ ] Have fresh data ready
- [ ] Know how to restore

After cleanup:
- [ ] Verified tables are empty
- [ ] Added fresh production data
- [ ] Tested website functionality
- [ ] Checked all pages load
- [ ] Confirmed admin access works
- [ ] Deleted backup tables (after verification)

## Support

If you need help:
1. Check Supabase Dashboard → Database → Logs
2. Check browser console for errors
3. Review RLS policies in Supabase
4. Test queries in SQL Editor first

---

**Remember:** When in doubt, test in staging first! 🚀

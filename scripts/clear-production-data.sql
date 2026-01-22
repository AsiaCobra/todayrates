-- =====================================================
-- CLEAR PRODUCTION SEED DATA
-- =====================================================
-- This script removes all seeded/test data from production
-- Tables structure and RLS policies remain intact
-- 
-- ⚠️  WARNING: This will DELETE all data!
-- ⚠️  Make sure you have backups if needed!
-- 
-- Recommended: Test in staging first
-- =====================================================

-- Show current data counts (before deletion)
SELECT 'BEFORE DELETION' as status;
SELECT 'Exchange Rates' as table_name, COUNT(*) as count FROM exchange_rates;
SELECT 'Gold Prices' as table_name, COUNT(*) as count FROM gold_prices;

-- =====================================================
-- DELETE ALL DATA
-- =====================================================

-- 1. Delete all exchange rates
DELETE FROM exchange_rates;

-- 2. Delete all gold prices
DELETE FROM gold_prices;

-- =====================================================
-- VERIFY DELETION
-- =====================================================

-- Show data counts after deletion (should be 0)
SELECT 'AFTER DELETION' as status;
SELECT 'Exchange Rates' as table_name, COUNT(*) as count FROM exchange_rates;
SELECT 'Gold Prices' as table_name, COUNT(*) as count FROM gold_prices;

-- =====================================================
-- RESET AUTO-INCREMENT (Optional)
-- =====================================================
-- Uncomment if you want IDs to start from 1 again:

-- ALTER SEQUENCE exchange_rates_id_seq RESTART WITH 1;
-- ALTER SEQUENCE gold_prices_id_seq RESTART WITH 1;

-- =====================================================
-- NOTES
-- =====================================================
-- ✓ Table structures preserved
-- ✓ RLS policies preserved
-- ✓ Indexes preserved
-- ✓ Ready for fresh production data
-- 
-- Next steps:
-- 1. Use admin panel to add real rates
-- 2. Use auto-generate feature for initial data
-- 3. Regular updates through admin interface
-- =====================================================

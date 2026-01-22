-- =====================================================
-- SELECTIVE DATA CLEANUP
-- =====================================================
-- Remove specific types of data while keeping others
-- =====================================================

-- Option 1: Delete rates older than specific date
-- DELETE FROM exchange_rates WHERE date < '2026-01-01';
-- DELETE FROM gold_prices WHERE date < '2026-01-01';

-- Option 2: Delete test/sample entries
-- DELETE FROM exchange_rates WHERE updated_by = 'seed_script';
-- DELETE FROM gold_prices WHERE updated_by = 'seed_script';

-- Option 3: Keep only latest N days of data
-- DELETE FROM exchange_rates WHERE created_at < NOW() - INTERVAL '7 days';
-- DELETE FROM gold_prices WHERE created_at < NOW() - INTERVAL '7 days';

-- Option 4: Delete specific currency
-- DELETE FROM exchange_rates WHERE currency_from = 'USD' AND currency_to = 'TEST';

-- Option 5: Delete specific gold type
-- DELETE FROM gold_prices WHERE gold_type = 'test_gold';

-- =====================================================
-- Verify what will be deleted (run this first!)
-- =====================================================

-- Check records that match your delete criteria:
-- SELECT * FROM exchange_rates WHERE date < '2026-01-01';
-- SELECT * FROM gold_prices WHERE date < '2026-01-01';

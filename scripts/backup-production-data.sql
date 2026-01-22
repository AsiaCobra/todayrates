-- =====================================================
-- BACKUP PRODUCTION DATA (Run BEFORE clearing)
-- =====================================================
-- This creates a backup of your current data
-- Run this first if you want to keep a copy
-- =====================================================

-- Create backup tables
CREATE TABLE IF NOT EXISTS exchange_rates_backup AS 
SELECT * FROM exchange_rates;

CREATE TABLE IF NOT EXISTS gold_prices_backup AS 
SELECT * FROM gold_prices;

-- Verify backup
SELECT 'Backup Created' as status;
SELECT 'Exchange Rates Backup' as table_name, COUNT(*) as count FROM exchange_rates_backup;
SELECT 'Gold Prices Backup' as table_name, COUNT(*) as count FROM gold_prices_backup;

-- =====================================================
-- TO RESTORE FROM BACKUP (if needed)
-- =====================================================
-- Uncomment and run these if you need to restore:

-- INSERT INTO exchange_rates SELECT * FROM exchange_rates_backup;
-- INSERT INTO gold_prices SELECT * FROM gold_prices_backup;

-- =====================================================
-- TO DELETE BACKUP TABLES (after confirming data is OK)
-- =====================================================
-- DROP TABLE exchange_rates_backup;
-- DROP TABLE gold_prices_backup;

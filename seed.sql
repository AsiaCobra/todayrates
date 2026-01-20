-- Seed data for exchange_rates and gold_prices
-- Run via: npm run seed

-- Clear existing data
DELETE FROM exchange_rates;
DELETE FROM gold_prices;

-- =============================================
-- EXCHANGE RATES SEED DATA
-- =============================================

INSERT INTO exchange_rates (currency_from, buying_rate, selling_rate, date) VALUES
  ('USD', 2095, 2105, CURRENT_DATE),
  ('EUR', 2280, 2300, CURRENT_DATE),
  ('SGD', 1560, 1580, CURRENT_DATE),
  ('THB', 58.5, 59.5, CURRENT_DATE),
  ('CNY', 290, 295, CURRENT_DATE),
  ('MYR', 470, 480, CURRENT_DATE),
  ('JPY', 14.0, 14.5, CURRENT_DATE);

-- Yesterday's data
INSERT INTO exchange_rates (currency_from, buying_rate, selling_rate, date) VALUES
  ('USD', 2090, 2100, CURRENT_DATE - 1),
  ('EUR', 2275, 2295, CURRENT_DATE - 1),
  ('SGD', 1555, 1575, CURRENT_DATE - 1),
  ('THB', 58.0, 59.0, CURRENT_DATE - 1),
  ('CNY', 288, 293, CURRENT_DATE - 1),
  ('MYR', 468, 478, CURRENT_DATE - 1),
  ('JPY', 13.9, 14.4, CURRENT_DATE - 1);

-- =============================================
-- GOLD PRICES SEED DATA
-- =============================================

-- Today's gold prices
INSERT INTO gold_prices (gold_type, unit, price, buying_price, selling_price, date) VALUES
  -- World Gold
  ('world', 'oz', 4673.56, NULL, NULL, CURRENT_DATE),
  -- Old System (စနစ်ဟောင်း)
  ('16pae_old', 'kyattha', NULL, 4850000, 4950000, CURRENT_DATE),
  ('15pae_old', 'kyattha', NULL, 4180000, 4380000, CURRENT_DATE),
  -- New System (စနစ်သစ်)
  ('16pae_new', 'kyattha', NULL, 4700000, 4800000, CURRENT_DATE),
  ('15pae_new', 'kyattha', NULL, 4140000, 4240000, CURRENT_DATE);

-- Yesterday's gold data
INSERT INTO gold_prices (gold_type, unit, price, buying_price, selling_price, date) VALUES
  -- World Gold
  ('world', 'oz', 4665.20, NULL, NULL, CURRENT_DATE - 1),
  -- Old System
  ('16pae_old', 'kyattha', NULL, 4840000, 4940000, CURRENT_DATE - 1),
  ('15pae_old', 'kyattha', NULL, 4170000, 4370000, CURRENT_DATE - 1),
  -- New System
  ('16pae_new', 'kyattha', NULL, 4690000, 4790000, CURRENT_DATE - 1),
  ('15pae_new', 'kyattha', NULL, 4130000, 4230000, CURRENT_DATE - 1);

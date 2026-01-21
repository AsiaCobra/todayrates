-- Run this SQL in your Supabase Dashboard SQL Editor
-- Go to: https://supabase.com/dashboard/project/wsubhohwogaslvysbqss/sql/new

-- =============================================
-- DROP TABLES (uncomment to reset database)
-- =============================================
DROP TABLE IF EXISTS exchange_rates CASCADE;
DROP TABLE IF EXISTS gold_prices CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;

-- =============================================
-- EXCHANGE RATES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  currency_from TEXT NOT NULL,
  currency_to TEXT NOT NULL DEFAULT 'MMK',
  buying_rate NUMERIC NOT NULL,
  selling_rate NUMERIC NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view rates" ON exchange_rates
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert rates" ON exchange_rates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update rates" ON exchange_rates
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete rates" ON exchange_rates
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- GOLD PRICES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS gold_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gold_type TEXT NOT NULL,
  unit TEXT NOT NULL,
  price NUMERIC,
  buying_price NUMERIC,
  selling_price NUMERIC,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gold prices" ON gold_prices
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert gold prices" ON gold_prices
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update gold prices" ON gold_prices
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete gold prices" ON gold_prices
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- CONTACTS TABLE
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

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update contacts" ON contacts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete contacts" ON contacts
  FOR DELETE USING (auth.role() = 'authenticated');

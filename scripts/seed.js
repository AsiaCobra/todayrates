import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
// Use service role key to bypass RLS for seeding
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL in .env')
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found in .env')
  console.warn('   Seeding requires service role key to bypass RLS.')
  console.warn('   Get it from: Supabase Dashboard > Settings > API > service_role key')
  console.warn('   Add to .env: SUPABASE_SERVICE_ROLE_KEY=your_key\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const today = new Date().toISOString().split('T')[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

async function seed() {
  console.log('Seeding database...\n')

  // Clear existing data
  console.log('Clearing existing data...')
  await supabase.from('exchange_rates').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('gold_prices').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // Seed exchange rates
  console.log('Seeding exchange rates...')
  const exchangeRates = [
    // Today
    { currency_from: 'USD', currency_to: 'MMK', buying_rate: 2095, selling_rate: 2105, date: today },
    { currency_from: 'EUR', currency_to: 'MMK', buying_rate: 2280, selling_rate: 2300, date: today },
    { currency_from: 'SGD', currency_to: 'MMK', buying_rate: 1560, selling_rate: 1580, date: today },
    { currency_from: 'THB', currency_to: 'MMK', buying_rate: 58.5, selling_rate: 59.5, date: today },
    { currency_from: 'CNY', currency_to: 'MMK', buying_rate: 290, selling_rate: 295, date: today },
    { currency_from: 'MYR', currency_to: 'MMK', buying_rate: 470, selling_rate: 480, date: today },
    { currency_from: 'JPY', currency_to: 'MMK', buying_rate: 14.0, selling_rate: 14.5, date: today },
    // Yesterday
    { currency_from: 'USD', currency_to: 'MMK', buying_rate: 2090, selling_rate: 2100, date: yesterday },
    { currency_from: 'EUR', currency_to: 'MMK', buying_rate: 2275, selling_rate: 2295, date: yesterday },
    { currency_from: 'SGD', currency_to: 'MMK', buying_rate: 1555, selling_rate: 1575, date: yesterday },
    { currency_from: 'THB', currency_to: 'MMK', buying_rate: 58.0, selling_rate: 59.0, date: yesterday },
    { currency_from: 'CNY', currency_to: 'MMK', buying_rate: 288, selling_rate: 293, date: yesterday },
    { currency_from: 'MYR', currency_to: 'MMK', buying_rate: 468, selling_rate: 478, date: yesterday },
    { currency_from: 'JPY', currency_to: 'MMK', buying_rate: 13.9, selling_rate: 14.4, date: yesterday },
  ]

  const { error: ratesError } = await supabase.from('exchange_rates').insert(exchangeRates)
  if (ratesError) {
    console.error('Error seeding exchange rates:', ratesError.message)
  } else {
    console.log(`  Inserted ${exchangeRates.length} exchange rates`)
  }

  // Seed gold prices
  console.log('Seeding gold prices...')
  const goldPrices = [
    // Today - World Gold
    { gold_type: 'world', unit: 'oz', price: 4673.56, buying_price: null, selling_price: null, date: today },
    // Today - Old System (စနစ်ဟောင်း)
    { gold_type: '16pae_old', unit: 'kyattha', price: null, buying_price: 4850000, selling_price: 4950000, date: today },
    { gold_type: '15pae_old', unit: 'kyattha', price: null, buying_price: 4180000, selling_price: 4380000, date: today },
    // Today - New System (စနစ်သစ်)
    { gold_type: '16pae_new', unit: 'kyattha', price: null, buying_price: 4700000, selling_price: 4800000, date: today },
    { gold_type: '15pae_new', unit: 'kyattha', price: null, buying_price: 4140000, selling_price: 4240000, date: today },
    // Yesterday - World Gold
    { gold_type: 'world', unit: 'oz', price: 4665.20, buying_price: null, selling_price: null, date: yesterday },
    // Yesterday - Old System
    { gold_type: '16pae_old', unit: 'kyattha', price: null, buying_price: 4840000, selling_price: 4940000, date: yesterday },
    { gold_type: '15pae_old', unit: 'kyattha', price: null, buying_price: 4170000, selling_price: 4370000, date: yesterday },
    // Yesterday - New System
    { gold_type: '16pae_new', unit: 'kyattha', price: null, buying_price: 4690000, selling_price: 4790000, date: yesterday },
    { gold_type: '15pae_new', unit: 'kyattha', price: null, buying_price: 4130000, selling_price: 4230000, date: yesterday },
  ]

  const { error: goldError } = await supabase.from('gold_prices').insert(goldPrices)
  if (goldError) {
    console.error('Error seeding gold prices:', goldError.message)
  } else {
    console.log(`  Inserted ${goldPrices.length} gold prices`)
  }

  console.log('\nSeeding complete!')
}

seed().catch(console.error)

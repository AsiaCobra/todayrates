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

// Generate dates for the last 30 days
const generateDates = () => {
  const dates = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

// Generate random variation for rates
const randomVariation = (baseRate, maxVariation = 0.02) => {
  const variation = (Math.random() - 0.5) * 2 * maxVariation
  return parseFloat((baseRate * (1 + variation)).toFixed(2))
}

async function seed() {
  console.log('Seeding database with 30 days of data for all 38 currencies...\n')

  // Clear existing data
  console.log('Clearing existing data...')
  await supabase.from('exchange_rates').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('gold_prices').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const dates = generateDates()
  
  // Base rates for all 38 currencies (CBM supported)
  const baseCurrencyRates = [
    { code: 'USD', buy: 2095, sell: 2105 },
    { code: 'EUR', buy: 2280, sell: 2300 },
    { code: 'SGD', buy: 1560, sell: 1580 },
    { code: 'GBP', buy: 2650, sell: 2670 },
    { code: 'CHF', buy: 2320, sell: 2340 },
    { code: 'JPY', buy: 14.0, sell: 14.5 },
    { code: 'AUD', buy: 1380, sell: 1400 },
    { code: 'BDT', buy: 17.5, sell: 18.0 },
    { code: 'BND', buy: 1550, sell: 1570 },
    { code: 'KHR', buy: 0.52, sell: 0.54 },
    { code: 'CAD', buy: 1520, sell: 1540 },
    { code: 'CNY', buy: 290, sell: 295 },
    { code: 'HKD', buy: 268, sell: 272 },
    { code: 'INR', buy: 25, sell: 25.5 },
    { code: 'IDR', buy: 0.13, sell: 0.14 },
    { code: 'KRW', buy: 1.6, sell: 1.65 },
    { code: 'LAK', buy: 0.096, sell: 0.10 },
    { code: 'MYR', buy: 470, sell: 480 },
    { code: 'NZD', buy: 1270, sell: 1290 },
    { code: 'PKR', buy: 7.5, sell: 7.8 },
    { code: 'PHP', buy: 36.5, sell: 37.0 },
    { code: 'LKR', buy: 6.4, sell: 6.6 },
    { code: 'THB', buy: 58.5, sell: 59.5 },
    { code: 'VND', buy: 0.083, sell: 0.086 },
    { code: 'BRL', buy: 420, sell: 430 },
    { code: 'CZK', buy: 92, sell: 94 },
    { code: 'DKK', buy: 305, sell: 310 },
    { code: 'EGP', buy: 42, sell: 43 },
    { code: 'ILS', buy: 585, sell: 595 },
    { code: 'KES', buy: 16.2, sell: 16.5 },
    { code: 'KWD', buy: 6850, sell: 6900 },
    { code: 'NPR', buy: 15.7, sell: 16.0 },
    { code: 'NOK', buy: 195, sell: 198 },
    { code: 'RUB', buy: 21.5, sell: 22.0 },
    { code: 'SAR', buy: 558, sell: 565 },
    { code: 'RSD', buy: 19.5, sell: 20.0 },
    { code: 'ZAR', buy: 115, sell: 118 },
    { code: 'SEK', buy: 200, sell: 203 },
  ]

  // Base gold prices
  const baseGoldPrices = {
    world: 4673.56,
    '16pae_old': { buy: 4850000, sell: 4950000 },
    '15pae_old': { buy: 4180000, sell: 4380000 },
    '16pae_new': { buy: 4700000, sell: 4800000 },
    '15pae_new': { buy: 4140000, sell: 4240000 },
  }

  const exchangeRates = []
  const goldPrices = []

  console.log('Generating exchange rates...')
  
  // Generate data for each date
  dates.forEach((date, dayIndex) => {
    // Determine number of updates for this day (1-3 for older days, 2-4 for recent days)
    const isRecentDay = dayIndex >= 27 // Last 3 days
    const numUpdates = isRecentDay ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 3) + 1
    
    // Generate multiple time entries per day
    for (let timeIndex = 0; timeIndex < numUpdates; timeIndex++) {
      // Generate time (spread throughout the day)
      const hour = 9 + Math.floor((timeIndex / numUpdates) * 8) // Between 9 AM and 5 PM
      const minute = Math.floor(Math.random() * 60)
      const dateTime = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`)
      
      // Exchange rates with daily variation
      baseCurrencyRates.forEach(currency => {
        exchangeRates.push({
          currency_from: currency.code,
          currency_to: 'MMK',
          buying_rate: randomVariation(currency.buy, 0.015),
          selling_rate: randomVariation(currency.sell, 0.015),
          date: date,
          created_at: dateTime.toISOString(),
        })
      })

      // Gold prices with daily variation (only 1-2 updates per day for gold)
      if (timeIndex < 2) {
        // World Gold
        goldPrices.push({
          gold_type: 'world',
          unit: 'oz',
          price: randomVariation(baseGoldPrices.world, 0.01),
          buying_price: null,
          selling_price: null,
          date: date,
          created_at: dateTime.toISOString(),
        })

        // Myanmar Gold types
        Object.entries(baseGoldPrices).forEach(([type, prices]) => {
          if (type !== 'world') {
            goldPrices.push({
              gold_type: type,
              unit: 'kyattha',
              price: null,
              buying_price: randomVariation(prices.buy, 0.01),
              selling_price: randomVariation(prices.sell, 0.01),
              date: date,
              created_at: dateTime.toISOString(),
            })
          }
        })
      }
    }

    // Slightly adjust base rates for next day to create trends
    baseCurrencyRates.forEach(currency => {
      currency.buy = randomVariation(currency.buy, 0.005)
      currency.sell = randomVariation(currency.sell, 0.005)
    })
    baseGoldPrices.world = randomVariation(baseGoldPrices.world, 0.005)
    Object.keys(baseGoldPrices).forEach(type => {
      if (type !== 'world') {
        baseGoldPrices[type].buy = randomVariation(baseGoldPrices[type].buy, 0.005)
        baseGoldPrices[type].sell = randomVariation(baseGoldPrices[type].sell, 0.005)
      }
    })
  })

  console.log(`  Inserting ${exchangeRates.length} exchange rates...`)
  const { error: ratesError } = await supabase.from('exchange_rates').insert(exchangeRates)
  if (ratesError) {
    console.error('Error seeding exchange rates:', ratesError.message)
  } else {
    console.log(`  ✓ Inserted ${exchangeRates.length} exchange rates`)
  }

  console.log(`  Inserting ${goldPrices.length} gold prices...`)
  const { error: goldError } = await supabase.from('gold_prices').insert(goldPrices)
  if (goldError) {
    console.error('Error seeding gold prices:', goldError.message)
  } else {
    console.log(`  ✓ Inserted ${goldPrices.length} gold prices`)
  }

  console.log('\n✅ Seeding complete!')
  console.log(`   📅 Generated data for ${dates.length} days`)
  console.log(`   💱 Total exchange rates: ${exchangeRates.length}`)
  console.log(`   🏆 Total gold prices: ${goldPrices.length}`)
}

seed().catch(console.error)

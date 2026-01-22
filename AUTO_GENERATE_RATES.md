# Auto-Generate Exchange Rates & Gold Prices

This document explains how the auto-generate feature works and how to set it up for automatic daily execution.

## How It Works

The auto-generate function fetches live data from external APIs and calculates Myanmar exchange rates:

### Exchange Rates Logic

1. **Fetch USD to MMK rate** from: `https://cdn.moneyconvert.net/api/latest.json`
2. **Apply black market multipliers**:
   - Buy rate multiplier: `1.8887`
   - Sell rate multiplier: `1.9381`
3. **Calculate USD to MMK rates**:
   - Buy rate: `MMK_rate × 1.8887`
   - Sell rate: `MMK_rate × 1.9381`
4. **Calculate other currencies**:
   - For each currency (THB, EUR, etc.):
     - Buy rate: `MMK_buy_rate ÷ currency_rate`
     - Sell rate: `MMK_sell_rate ÷ currency_rate`

### Gold Price

- Fetches world gold price (XAU) from: `https://api.gold-api.com/price/XAU`
- Price is in USD per troy ounce

## Manual Trigger (Admin Panel)

1. Log in to the admin panel
2. Go to **Exchange Rates** or **Gold Prices** tab
3. Click the **"Generate Now"** button in the purple card
4. Confirm the action
5. The system will:
   - Fetch current rates from APIs
   - Calculate all exchange rates
   - Insert data into the database with today's date

## Automatic Execution at Midnight

Since this is a static site hosted on GitHub Pages, you have a few options for automatic execution:

### Option 1: Supabase Edge Functions (Recommended)

Create a Supabase Edge Function that runs on a schedule:

```sql
-- Create a database function
CREATE OR REPLACE FUNCTION generate_daily_rates()
RETURNS void AS $$
BEGIN
  -- Your logic to call the edge function
END;
$$ LANGUAGE plpgsql;

-- Schedule it with pg_cron (if available)
SELECT cron.schedule('generate-daily-rates', '0 0 * * *', 'SELECT generate_daily_rates()');
```

Then create an Edge Function:
```bash
supabase functions new generate-rates
```

### Option 2: GitHub Actions

Create `.github/workflows/generate-rates.yml`:

```yaml
name: Generate Daily Rates

on:
  schedule:
    # Runs at 00:00 UTC every day
    - cron: '0 0 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Call Generate API
        run: |
          curl -X POST ${{ secrets.SUPABASE_URL }}/rest/v1/rpc/generate_rates \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json"
```

### Option 3: External Cron Service

Use services like:
- **Cron-job.org**
- **EasyCron**
- **Zapier**
- **IFTTT**

Configure them to call your Supabase function at midnight.

### Option 4: Server-Side Script

If you have a server, create a Node.js cron job:

```bash
npm install node-cron
```

```javascript
// generate-cron.js
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const { generateAllRates } = require('./src/lib/autoGenerateRates');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Generating daily rates...');
  const result = await generateAllRates('system-user-id');
  console.log('Result:', result);
});
```

## API Keys

### MoneyConvert API
- URL: `https://cdn.moneyconvert.net/api/latest.json`
- Free, no API key required
- Returns rates for all currencies

### Gold API
- URL: `https://api.gold-api.com/price/XAU`
- May require API key for production use
- Check their documentation: https://www.goldapi.io/

## Updating Multipliers

To update the black market multipliers, edit `/src/lib/autoGenerateRates.js`:

```javascript
const BLACK_MARKET_BUY_MULTIPLIER = 1.8887
const BLACK_MARKET_SELL_MULTIPLIER = 1.9381
```

## Testing

Test the auto-generate function in the browser console:

```javascript
import { generateAllRates } from './lib/autoGenerateRates'

// Generate rates for today
const result = await generateAllRates('your-user-id')
console.log(result)

// Generate rates for a specific date
const result = await generateAllRates('your-user-id', '2026-01-22')
console.log(result)
```

## Troubleshooting

### API Rate Limits
- MoneyConvert: Check their rate limits
- Gold API: Free tier may have limits

### CORS Issues
- These APIs support CORS for browser requests
- If you encounter CORS errors, use a server-side proxy

### Duplicate Entries
- The system allows multiple rates for the same day
- Consider adding a check to prevent duplicates if needed

## Future Enhancements

1. **Duplicate Prevention**: Add logic to check if rates exist for today before generating
2. **Rate History**: Keep track of when rates were auto-generated vs manually entered
3. **Notification System**: Send email/SMS when rates are generated
4. **Backup APIs**: Add fallback APIs in case primary APIs fail
5. **Rate Validation**: Add validation to ensure rates are within expected ranges

import { supabase } from './supabase'
import { CURRENCY_ORDER } from './currencies'
import { getSettings } from './settings'

/**
 * Get black market multipliers from settings
 */
const getMultipliers = () => {
  const settings = getSettings()
  return {
    buyMultiplier: settings.blackMarketBuyMultiplier,
    sellMultiplier: settings.blackMarketSellMultiplier
  }
}

/**
 * Fetch exchange rates from MoneyConvert API
 */
const fetchMoneyConvertRates = async () => {
  const response = await fetch('https://cdn.moneyconvert.net/api/latest.json')
  if (!response.ok) {
    throw new Error('Failed to fetch exchange rates from MoneyConvert')
  }
  const data = await response.json()
  return data.rates
}

/**
 * Fetch gold price from Gold API
 */
const fetchGoldPrice = async () => {
  const response = await fetch('https://api.gold-api.com/price/XAU')
  if (!response.ok) {
    throw new Error('Failed to fetch gold price')
  }
  const data = await response.json()
  // The API returns price per troy ounce in USD
  return data.price
}

/**
 * Calculate MMK buy and sell rates based on USD rate
 */
const calculateMMKRates = (usdRate) => {
  const { buyMultiplier, sellMultiplier } = getMultipliers()
  const buyRate = usdRate * buyMultiplier
  const sellRate = usdRate * sellMultiplier
  return { buyRate, sellRate }
}

/**
 * Calculate exchange rates for a currency against MMK
 */
const calculateCurrencyToMMK = (currencyRate, mmkBuyRate, mmkSellRate) => {
  const buyRate = mmkBuyRate / currencyRate
  const sellRate = mmkSellRate / currencyRate
  return { buyRate, sellRate }
}

/**
 * Round to appropriate decimal places
 */
const roundRate = (rate) => {
  if (rate < 1) {
    return Math.round(rate * 100) / 100 // 2 decimal places
  } else if (rate < 100) {
    return Math.round(rate * 100) / 100 // 2 decimal places
  } else {
    return Math.round(rate * 100) / 100 // 2 decimal places
  }
}

/**
 * Calculate exchange rates without inserting to database (for preview/forms)
 */
export const calculateExchangeRates = async () => {
  try {
    // Fetch rates from MoneyConvert API
    const rates = await fetchMoneyConvertRates()
    
    // Get USD rate (MMK per 1 USD from the API)
    const usdToMmkRate = rates.MMK
    if (!usdToMmkRate) {
      throw new Error('MMK rate not found in API response')
    }
    
    // Calculate Myanmar black market rates for USD
    const { buyRate: mmkBuyRate, sellRate: mmkSellRate } = calculateMMKRates(usdToMmkRate)
    
    // Generate rates for all currencies
    const exchangeRates = []
    
    for (const currencyCode of CURRENCY_ORDER) {
      if (currencyCode === 'MMK') continue // Skip MMK itself
      
      let buyRate, sellRate
      
      if (currencyCode === 'USD') {
        // Direct USD to MMK rates
        buyRate = mmkBuyRate
        sellRate = mmkSellRate
      } else {
        // Get the currency rate from API
        const currencyRate = rates[currencyCode]
        if (!currencyRate) {
          console.warn(`Rate not found for ${currencyCode}, skipping...`)
          continue
        }
        
        // Calculate rates
        const calculated = calculateCurrencyToMMK(currencyRate, mmkBuyRate, mmkSellRate)
        buyRate = calculated.buyRate
        sellRate = calculated.sellRate
      }
      
      exchangeRates.push({
        code: currencyCode,
        buying: roundRate(buyRate),
        selling: roundRate(sellRate)
      })
    }
    
    return exchangeRates
  } catch (error) {
    console.error('Error calculating exchange rates:', error)
    throw error
  }
}

/**
 * Calculate Myanmar gold prices based on world gold price
 */
const calculateMyanmarGoldPrices = (worldGoldPrice, mmkSellRate) => {
  const settings = getSettings()
  const multiplier16Old = settings.gold16PeyeOldMultiplier
  const multiplier16New = settings.gold16PeyeNewMultiplier
  
  // Calculate 16 PeYe prices
  const gold16PeyeOld = (worldGoldPrice / multiplier16Old) * mmkSellRate
  const gold16PeyeNew = (worldGoldPrice / multiplier16New) * mmkSellRate
  
  // Calculate 15 PeYe prices (16 PeYe / 17 * 16)
  const gold15PeyeOld = (gold16PeyeOld / 17) * 16
  const gold15PeyeNew = (gold16PeyeNew / 17) * 16
  
  return {
    '16peye_old': Math.round(gold16PeyeOld * 100) / 100,
    '16peye_new': Math.round(gold16PeyeNew * 100) / 100,
    '15peye_old': Math.round(gold15PeyeOld * 100) / 100,
    '15peye_new': Math.round(gold15PeyeNew * 100) / 100
  }
}

/**
 * Calculate gold price without inserting to database (for preview/forms)
 */
export const calculateGoldPrice = async () => {
  try {
    // Fetch gold price from API
    const worldGoldPrice = await fetchGoldPrice()
    
    if (!worldGoldPrice) {
      throw new Error('Failed to fetch gold price')
    }
    
    // Fetch MMK rates to calculate Myanmar gold prices
    const rates = await fetchMoneyConvertRates()
    const usdToMmkRate = rates.MMK
    if (!usdToMmkRate) {
      throw new Error('MMK rate not found in API response')
    }
    
    // Calculate Myanmar sell rate
    const { sellRate: mmkSellRate } = calculateMMKRates(usdToMmkRate)
    
    // Calculate Myanmar gold prices
    const myanmarGoldPrices = calculateMyanmarGoldPrices(worldGoldPrice, mmkSellRate)
    
    return {
      world: worldGoldPrice,
      ...myanmarGoldPrices
    }
  } catch (error) {
    console.error('Error calculating gold price:', error)
    throw error
  }
}

/**
 * Generate exchange rates for all currencies
 */
export const generateExchangeRates = async (userId, date = null) => {
  try {
    // Use provided date or today's date
    const targetDate = date || new Date().toISOString().split('T')[0]
    
    // Fetch rates from MoneyConvert API
    const rates = await fetchMoneyConvertRates()
    
    // Get USD rate (MMK per 1 USD from the API)
    const usdToMmkRate = rates.MMK
    if (!usdToMmkRate) {
      throw new Error('MMK rate not found in API response')
    }
    
    // Calculate Myanmar black market rates for USD
    const { buyRate: mmkBuyRate, sellRate: mmkSellRate } = calculateMMKRates(usdToMmkRate)
    
    // Generate rates for all currencies
    const exchangeRates = []
    
    for (const currencyCode of CURRENCY_ORDER) {
      if (currencyCode === 'MMK') continue // Skip MMK itself
      
      let buyRate, sellRate
      
      if (currencyCode === 'USD') {
        // Direct USD to MMK rates
        buyRate = mmkBuyRate
        sellRate = mmkSellRate
      } else {
        // Get the currency rate from API
        const currencyRate = rates[currencyCode]
        if (!currencyRate) {
          console.warn(`Rate not found for ${currencyCode}, skipping...`)
          continue
        }
        
        // Calculate rates
        const calculated = calculateCurrencyToMMK(currencyRate, mmkBuyRate, mmkSellRate)
        buyRate = calculated.buyRate
        sellRate = calculated.sellRate
      }
      
      exchangeRates.push({
        currency_from: currencyCode,
        currency_to: 'MMK',
        buying_rate: roundRate(buyRate),
        selling_rate: roundRate(sellRate),
        date: targetDate,
        updated_by: userId
      })
    }
    
    // Insert rates into database
    const { data, error } = await supabase
      .from('exchange_rates')
      .insert(exchangeRates)
      .select()
    
    if (error) throw error
    
    return {
      success: true,
      count: data.length,
      rates: data
    }
  } catch (error) {
    console.error('Error generating exchange rates:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Generate world gold price and Myanmar gold prices
 */
export const generateGoldPrice = async (userId, date = null) => {
  try {
    // Use provided date or today's date
    const targetDate = date || new Date().toISOString().split('T')[0]
    
    // Fetch gold price from API
    const worldGoldPrice = await fetchGoldPrice()
    
    if (!worldGoldPrice) {
      throw new Error('Failed to fetch gold price')
    }
    
    // Fetch MMK rates to calculate Myanmar gold prices
    const rates = await fetchMoneyConvertRates()
    const usdToMmkRate = rates.MMK
    if (!usdToMmkRate) {
      throw new Error('MMK rate not found in API response')
    }
    
    // Calculate Myanmar sell rate
    const { sellRate: mmkSellRate } = calculateMMKRates(usdToMmkRate)
    
    // Calculate Myanmar gold prices
    const myanmarGoldPrices = calculateMyanmarGoldPrices(worldGoldPrice, mmkSellRate)
    
    // Prepare all gold price records
    const goldPriceRecords = [
      {
        gold_type: 'world',
        unit: 'oz',
        price: roundRate(worldGoldPrice),
        buying_price: null,
        selling_price: null,
        date: targetDate,
        updated_by: userId
      },
      {
        gold_type: '16peye_old',
        unit: 'Kyatthar',
        price: null,
        buying_price: myanmarGoldPrices['16peye_old'],
        selling_price: myanmarGoldPrices['16peye_old'],
        date: targetDate,
        updated_by: userId
      },
      {
        gold_type: '16peye_new',
        unit: 'Kyatthar',
        price: null,
        buying_price: myanmarGoldPrices['16peye_new'],
        selling_price: myanmarGoldPrices['16peye_new'],
        date: targetDate,
        updated_by: userId
      },
      {
        gold_type: '15peye_old',
        unit: 'Kyatthar',
        price: null,
        buying_price: myanmarGoldPrices['15peye_old'],
        selling_price: myanmarGoldPrices['15peye_old'],
        date: targetDate,
        updated_by: userId
      },
      {
        gold_type: '15peye_new',
        unit: 'Kyatthar',
        price: null,
        buying_price: myanmarGoldPrices['15peye_new'],
        selling_price: myanmarGoldPrices['15peye_new'],
        date: targetDate,
        updated_by: userId
      }
    ]
    
    // Insert all gold prices into database
    const { data, error } = await supabase
      .from('gold_prices')
      .insert(goldPriceRecords)
      .select()
    
    if (error) throw error
    
    return {
      success: true,
      count: data.length,
      price: data[0].price,
      data: data
    }
  } catch (error) {
    console.error('Error generating gold price:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Generate both exchange rates and gold price
 */
export const generateAllRates = async (userId, date = null) => {
  const [ratesResult, goldResult] = await Promise.all([
    generateExchangeRates(userId, date),
    generateGoldPrice(userId, date)
  ])
  
  return {
    rates: ratesResult,
    gold: goldResult
  }
}

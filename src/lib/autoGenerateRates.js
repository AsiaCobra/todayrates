import { supabase } from './supabase'
import { CURRENCY_ORDER } from './currencies'

// Black market multipliers
const BLACK_MARKET_BUY_MULTIPLIER = 1.8887
const BLACK_MARKET_SELL_MULTIPLIER = 1.9381

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
  const buyRate = usdRate * BLACK_MARKET_BUY_MULTIPLIER
  const sellRate = usdRate * BLACK_MARKET_SELL_MULTIPLIER
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
 * Calculate gold price without inserting to database (for preview/forms)
 */
export const calculateGoldPrice = async () => {
  try {
    // Fetch gold price from API
    const goldPrice = await fetchGoldPrice()
    
    if (!goldPrice) {
      throw new Error('Failed to fetch gold price')
    }
    
    return goldPrice
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
 * Generate world gold price
 */
export const generateGoldPrice = async (userId, date = null) => {
  try {
    // Use provided date or today's date
    const targetDate = date || new Date().toISOString().split('T')[0]
    
    // Fetch gold price from API
    const goldPrice = await fetchGoldPrice()
    
    if (!goldPrice) {
      throw new Error('Failed to fetch gold price')
    }
    
    // Insert gold price into database
    const { data, error } = await supabase
      .from('gold_prices')
      .insert({
        gold_type: 'world',
        unit: 'oz',
        price: roundRate(goldPrice),
        date: targetDate,
        updated_by: userId
      })
      .select()
    
    if (error) throw error
    
    return {
      success: true,
      price: data[0].price,
      data: data[0]
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

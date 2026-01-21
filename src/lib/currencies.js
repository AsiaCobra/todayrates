// Central Bank of Myanmar supported currencies
// Source: https://forex.cbm.gov.mm/api/currencies

export const CURRENCIES = {
  USD: { code: 'USD', name: 'United State Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  GBP: { code: 'GBP', name: 'Pound Sterling', symbol: '£', flag: '🇬🇧' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  BDT: { code: 'BDT', name: 'Bangladesh Taka', symbol: '৳', flag: '🇧🇩' },
  BND: { code: 'BND', name: 'Brunei Dollar', symbol: 'B$', flag: '🇧🇳' },
  KHR: { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', flag: '🇰🇭' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  KRW: { code: 'KRW', name: 'Korean Won', symbol: '₩', flag: '🇰🇷' },
  LAK: { code: 'LAK', name: 'Lao Kip', symbol: '₭', flag: '🇱🇦' },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  PKR: { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  PHP: { code: 'PHP', name: 'Philippines Peso', symbol: '₱', flag: '🇵🇭' },
  LKR: { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰' },
  THB: { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  VND: { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  CZK: { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: '£', flag: '🇪🇬' },
  ILS: { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
  KES: { code: 'KES', name: 'Kenya Shilling', symbol: 'KSh', flag: '🇰🇪' },
  KWD: { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼' },
  NPR: { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', flag: '🇳🇵' },
  NOK: { code: 'NOK', name: 'Norwegian Kroner', symbol: 'kr', flag: '🇳🇴' },
  RUB: { code: 'RUB', name: 'Russian Rouble', symbol: '₽', flag: '🇷🇺' },
  SAR: { code: 'SAR', name: 'Saudi Arabian Riyal', symbol: 'SR', flag: '🇸🇦' },
  RSD: { code: 'RSD', name: 'Serbian Dinar', symbol: 'din', flag: '🇷🇸' },
  ZAR: { code: 'ZAR', name: 'South Africa Rand', symbol: 'R', flag: '🇿🇦' },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
}

// Display order for currencies (popular ones first)
export const CURRENCY_ORDER = [
  'USD', 'EUR', 'GBP', 'SGD', 'THB', 'CNY', 'MYR', 'JPY', 'KRW', 'INR', 'AUD', 'CAD',
  'HKD', 'CHF', 'IDR', 'PHP', 'VND', 'BDT', 'LKR', 'PKR', 'NPR', 'BND', 'KHR', 'LAK',
  'SAR', 'KWD', 'BRL', 'NZD', 'ZAR', 'RUB', 'NOK', 'SEK', 'DKK', 'CZK', 'ILS', 'EGP',
  'KES', 'RSD'
]

// Get currency metadata with fallback
export const getCurrencyMeta = (code) => {
  return CURRENCIES[code] || { 
    code, 
    name: code, 
    symbol: code, 
    flag: '💱' 
  }
}

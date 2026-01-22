/**
 * Settings utility for localStorage management
 */

const SETTINGS_KEY = 'todayrates_settings'

// Default settings
const DEFAULT_SETTINGS = {
  blackMarketBuyMultiplier: 1.8887,
  blackMarketSellMultiplier: 1.9381,
  gold16PeyeOldMultiplier: 1.875,
  gold16PeyeNewMultiplier: 1.905
}

/**
 * Get all settings from localStorage
 */
export const getSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
    return DEFAULT_SETTINGS
  } catch (error) {
    console.error('Error reading settings:', error)
    return DEFAULT_SETTINGS
  }
}

/**
 * Save settings to localStorage
 */
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    return false
  }
}

/**
 * Get specific setting value
 */
export const getSetting = (key) => {
  const settings = getSettings()
  return settings[key] ?? DEFAULT_SETTINGS[key]
}

/**
 * Reset settings to defaults
 */
export const resetSettings = () => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS))
    return DEFAULT_SETTINGS
  } catch (error) {
    console.error('Error resetting settings:', error)
    return DEFAULT_SETTINGS
  }
}

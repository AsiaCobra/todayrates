import { useState, useEffect } from 'react'
import { getSettings, saveSettings, resetSettings } from '../lib/settings'

export default function Settings() {
  const [settings, setSettings] = useState({
    blackMarketBuyMultiplier: 1.8887,
    blackMarketSellMultiplier: 1.9381,
    gold16PeyeOldMultiplier: 1.875,
    gold16PeyeNewMultiplier: 1.905
  })
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load settings from localStorage
    const storedSettings = getSettings()
    setSettings(storedSettings)
  }, [])

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
    setSaveSuccess(false)
    setError(null)
  }

  const handleSave = () => {
    try {
      setSaving(true)
      setError(null)

      // Validate inputs
      const buyMultiplier = parseFloat(settings.blackMarketBuyMultiplier)
      const sellMultiplier = parseFloat(settings.blackMarketSellMultiplier)
      const gold16Old = parseFloat(settings.gold16PeyeOldMultiplier)
      const gold16New = parseFloat(settings.gold16PeyeNewMultiplier)

      if (isNaN(buyMultiplier) || buyMultiplier <= 0) {
        throw new Error('Buy multiplier must be a positive number')
      }

      if (isNaN(sellMultiplier) || sellMultiplier <= 0) {
        throw new Error('Sell multiplier must be a positive number')
      }

      if (buyMultiplier >= sellMultiplier) {
        throw new Error('Sell multiplier should be higher than buy multiplier')
      }

      if (isNaN(gold16Old) || gold16Old <= 0) {
        throw new Error('16 PeYe (Old) multiplier must be a positive number')
      }

      if (isNaN(gold16New) || gold16New <= 0) {
        throw new Error('16 PeYe (New) multiplier must be a positive number')
      }

      // Save to localStorage
      const saved = saveSettings({
        blackMarketBuyMultiplier: buyMultiplier,
        blackMarketSellMultiplier: sellMultiplier,
        gold16PeyeOldMultiplier: gold16Old,
        gold16PeyeNewMultiplier: gold16New
      })

      if (saved) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Reset to default multipliers?\n\nBlack Market:\nBuy: 1.8887\nSell: 1.9381\n\nMyanmar Gold:\n16 PeYe Old: 1.875\n16 PeYe New: 1.905')) {
      const defaults = resetSettings()
      setSettings(defaults)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {saveSuccess && (
        <div className="glass-card rounded-xl p-4 border border-emerald-500/30 bg-emerald-500/10">
          <p className="text-sm text-emerald-400">✓ Settings saved successfully!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="glass-card rounded-xl p-4 border border-rose-500/30 bg-rose-500/10">
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}

      {/* Settings Content */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Black Market Multipliers
          </h3>
          
          <div className="space-y-4">
            {/* Buy Multiplier */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Buy Multiplier
              </label>
              <input
                type="number"
                step="0.0001"
                value={settings.blackMarketBuyMultiplier}
                onChange={(e) => handleChange('blackMarketBuyMultiplier', e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
                placeholder="1.8887"
              />
              <p className="text-xs text-slate-500 mt-1">
                Multiplier used to calculate buy rates (e.g., 1.8887)
              </p>
            </div>

            {/* Sell Multiplier */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sell Multiplier
              </label>
              <input
                type="number"
                step="0.0001"
                value={settings.blackMarketSellMultiplier}
                onChange={(e) => handleChange('blackMarketSellMultiplier', e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
                placeholder="1.9381"
              />
              <p className="text-xs text-slate-500 mt-1">
                Multiplier used to calculate sell rates (e.g., 1.9381)
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-blue-300">
                  <p className="font-medium mb-1">How it works:</p>
                  <p className="text-blue-400/80">
                    Official USD rate × Buy Multiplier = Myanmar Buy Rate<br/>
                    Official USD rate × Sell Multiplier = Myanmar Sell Rate<br/>
                    <span className="text-blue-300 mt-1 block">
                      Example: 2100 × 1.8887 = 3962.36 MMK (Buy)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Myanmar Gold Multipliers */}
        <div>
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Myanmar Gold Multipliers
          </h3>
          
          <div className="space-y-4">
            {/* 16 PeYe Old Multiplier */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                16 PeYe (Old) Multiplier
              </label>
              <input
                type="number"
                step="0.001"
                value={settings.gold16PeyeOldMultiplier}
                onChange={(e) => handleChange('gold16PeyeOldMultiplier', e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                placeholder="1.875"
              />
              <p className="text-xs text-slate-500 mt-1">
                Multiplier for 16 PeYe old gold calculation (e.g., 1.875)
              </p>
            </div>

            {/* 16 PeYe New Multiplier */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                16 PeYe (New) Multiplier
              </label>
              <input
                type="number"
                step="0.001"
                value={settings.gold16PeyeNewMultiplier}
                onChange={(e) => handleChange('gold16PeyeNewMultiplier', e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                placeholder="1.905"
              />
              <p className="text-xs text-slate-500 mt-1">
                Multiplier for 16 PeYe new gold calculation (e.g., 1.905)
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-yellow-300">
                  <p className="font-medium mb-1">How it works:</p>
                  <p className="text-yellow-400/80">
                    16 PeYe: World Gold / Multiplier × MMK Sell Rate<br/>
                    15 PeYe: 16 PeYe Price / 17 × 16<br/>
                    <span className="text-yellow-300 mt-1 block">
                      Example: 4836.40 / 1.875 × 4070.17 = 10,505,137 MMK
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Settings</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={saving}
            className="py-3 px-4 rounded-xl font-medium text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  )
}

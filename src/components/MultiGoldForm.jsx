import { useState, useEffect } from 'react'
import GoldTypeCard from './GoldTypeCard'

const GOLD_TYPES = [
  { type: 'world', name: 'World Gold', unit: 'oz' },
  { type: '16peye_old', name: '16 PeYe (Old)', unit: 'Kyatthar' },
  { type: '15peye_old', name: '15 PeYe (Old)', unit: 'Kyatthar' },
  { type: '16peye_new', name: '16 PeYe (New)', unit: 'Kyatthar' },
  { type: '15peye_new', name: '15 PeYe (New)', unit: 'Kyatthar' }
]

export default function MultiGoldForm({ onSubmit, onCancel, calculatedPrice = null }) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [prices, setPrices] = useState(() => {
    // Initialize with all gold types unselected and empty or calculated values
    const initialPrices = {}
    GOLD_TYPES.forEach(({ type }) => {
      initialPrices[type] = {
        selected: false,
        price: type === 'world' && calculatedPrice ? calculatedPrice.toFixed(2) : '',
        buying: '',
        selling: ''
      }
    })
    return initialPrices
  })
  
  // Update world gold price when calculatedPrice changes
  useEffect(() => {
    if (calculatedPrice) {
      setPrices(prev => ({
        ...prev,
        world: {
          ...prev.world,
          price: calculatedPrice.toFixed(2)
        }
      }))
    }
  }, [calculatedPrice])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleToggle = (type, checked) => {
    setPrices(prev => ({
      ...prev,
      [type]: { ...prev[type], selected: checked }
    }))
  }

  const handleChange = (type, field, value) => {
    setPrices(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }))
  }

  const handleSelectAll = () => {
    const allSelected = Object.values(prices).every(p => p.selected)
    const newPrices = {}
    Object.keys(prices).forEach(type => {
      newPrices[type] = { ...prices[type], selected: !allSelected }
    })
    setPrices(newPrices)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Get selected prices
    const selectedPrices = Object.entries(prices)
      .filter(([_, data]) => data.selected)
      .map(([type, data]) => {
        if (type === 'world') {
          return {
            type,
            price: parseFloat(data.price)
          }
        } else {
          return {
            type,
            buying: parseFloat(data.buying),
            selling: parseFloat(data.selling)
          }
        }
      })

    // Validation
    if (selectedPrices.length === 0) {
      setError('Please select at least one gold type')
      return
    }

    const invalidPrices = selectedPrices.filter(p => {
      if (p.type === 'world') {
        return !p.price || p.price <= 0
      } else {
        return !p.buying || !p.selling || p.buying <= 0 || p.selling <= 0
      }
    })
    
    if (invalidPrices.length > 0) {
      const goldTypes = GOLD_TYPES.filter(g => invalidPrices.some(p => p.type === g.type))
      setError(`Please enter valid prices for: ${goldTypes.map(g => g.name).join(', ')}`)
      return
    }

    setSubmitting(true)
    
    try {
      await onSubmit(date, selectedPrices)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedCount = Object.values(prices).filter(p => p.selected).length

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
            required
            className="px-3 py-2 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={handleSelectAll}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
        >
          {Object.values(prices).every(p => p.selected) ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}

      {/* Gold Types Grid */}
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {GOLD_TYPES.map(({ type, name, unit }) => {
            const priceData = prices[type]
            return (
              <GoldTypeCard
                key={type}
                goldType={type}
                name={name}
                unit={unit}
                selected={priceData.selected}
                price={priceData.price}
                buyingPrice={priceData.buying}
                sellingPrice={priceData.selling}
                onChange={handleChange}
                onToggle={handleToggle}
              />
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-400">
          {selectedCount} {selectedCount === 1 ? 'type' : 'types'} selected
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || selectedCount === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save All ({selectedCount})</span>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

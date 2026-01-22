import { useState } from 'react'
import { CURRENCY_ORDER, getCurrencyMeta } from '../lib/currencies'
import CurrencyCard from './CurrencyCard'

export default function MultiRateForm({ onSubmit, onCancel }) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [rates, setRates] = useState(() => {
    // Initialize with all currencies unselected
    const initialRates = {}
    CURRENCY_ORDER.forEach(code => {
      initialRates[code] = {
        selected: false,
        buying: '',
        selling: ''
      }
    })
    return initialRates
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleToggle = (code, checked) => {
    setRates(prev => ({
      ...prev,
      [code]: { ...prev[code], selected: checked }
    }))
  }

  const handleChange = (code, field, value) => {
    setRates(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        [field === 'buying' ? 'buying' : 'selling']: value
      }
    }))
  }

  const handleSelectAll = () => {
    const allSelected = Object.values(rates).every(r => r.selected)
    const newRates = {}
    Object.keys(rates).forEach(code => {
      newRates[code] = { ...rates[code], selected: !allSelected }
    })
    setRates(newRates)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Get selected rates
    const selectedRates = Object.entries(rates)
      .filter(([_, data]) => data.selected)
      .map(([code, data]) => ({
        code,
        buying: parseFloat(data.buying),
        selling: parseFloat(data.selling)
      }))

    // Validation
    if (selectedRates.length === 0) {
      setError('Please select at least one currency')
      return
    }

    const invalidRates = selectedRates.filter(r => 
      !r.buying || !r.selling || r.buying <= 0 || r.selling <= 0
    )
    
    if (invalidRates.length > 0) {
      setError(`Please enter valid rates for: ${invalidRates.map(r => r.code).join(', ')}`)
      return
    }

    setSubmitting(true)
    
    try {
      await onSubmit(date, selectedRates)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedCount = Object.values(rates).filter(r => r.selected).length

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
            className="px-3 py-2 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={handleSelectAll}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
        >
          {Object.values(rates).every(r => r.selected) ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}

      {/* Currency Grid */}
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CURRENCY_ORDER.map(code => {
            const meta = getCurrencyMeta(code)
            const rateData = rates[code]
            return (
              <CurrencyCard
                key={code}
                code={code}
                meta={meta}
                selected={rateData.selected}
                buyingRate={rateData.buying}
                sellingRate={rateData.selling}
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
          {selectedCount} {selectedCount === 1 ? 'currency' : 'currencies'} selected
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
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
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

import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CURRENCIES, CURRENCY_ORDER } from '../lib/currencies'

export default function RateForm({ rate, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    currency_from: 'USD',
    currency_to: 'MMK',
    buying_rate: '',
    selling_rate: '',
  })
  const [selectedDateTime, setSelectedDateTime] = useState(new Date())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (rate) {
      const rateDate = rate.created_at ? new Date(rate.created_at) : new Date()
      setFormData({
        currency_from: rate.currency_from || 'USD',
        currency_to: rate.currency_to || 'MMK',
        buying_rate: rate.buying_rate || '',
        selling_rate: rate.selling_rate || '',
      })
      setSelectedDateTime(rateDate)
    }
  }, [rate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const dateStr = selectedDateTime.toISOString().split('T')[0]
      await onSubmit({
        currency_from: formData.currency_from,
        currency_to: formData.currency_to,
        buying_rate: parseFloat(formData.buying_rate),
        selling_rate: parseFloat(formData.selling_rate),
        date: dateStr,
        created_at: selectedDateTime.toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 focus:outline-none transition-colors"
  const labelClass = "block text-sm font-medium text-slate-300 mb-2"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="currency_from" className={labelClass}>Currency</label>
          <select id="currency_from" name="currency_from" value={formData.currency_from} onChange={handleChange} className={inputClass}>
            {CURRENCY_ORDER.map(code => (
              <option key={code} value={code}>
                {code} - {CURRENCIES[code].name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="currency_to" className={labelClass}>To</label>
          <input type="text" value="MMK" disabled className={`${inputClass} bg-slate-800 cursor-not-allowed`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="buying_rate" className={labelClass}>Buy Rate</label>
          <input
            type="number"
            id="buying_rate"
            name="buying_rate"
            value={formData.buying_rate}
            onChange={handleChange}
            step="0.01"
            required
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="selling_rate" className={labelClass}>Sell Rate</label>
          <input
            type="number"
            id="selling_rate"
            name="selling_rate"
            value={formData.selling_rate}
            onChange={handleChange}
            step="0.01"
            required
            placeholder="0.00"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Date & Time</label>
        <DatePicker
          selected={selectedDateTime}
          onChange={(date) => setSelectedDateTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          className={inputClass}
          wrapperClassName="w-full"
          required
        />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex-1 py-3 px-4 rounded-xl font-medium text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {loading ? 'Saving...' : rate ? 'Update' : 'Add Rate'}
        </button>
      </div>
    </form>
  )
}

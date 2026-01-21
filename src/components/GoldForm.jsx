import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function GoldForm({ gold, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    gold_type: 'world',
    unit: 'oz',
    price: '',
    buying_price: '',
    selling_price: '',
  })
  const [selectedDateTime, setSelectedDateTime] = useState(new Date())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (gold) {
      const goldDate = gold.created_at ? new Date(gold.created_at) : new Date()
      setFormData({
        gold_type: gold.gold_type || 'world',
        unit: gold.unit || 'oz',
        price: gold.price || '',
        buying_price: gold.buying_price || '',
        selling_price: gold.selling_price || '',
      })
      setSelectedDateTime(goldDate)
    }
  }, [gold])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'gold_type') {
      const unit = value === 'world' ? 'oz' : 'kyattha'
      setFormData((prev) => ({ ...prev, [name]: value, unit }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const dateStr = selectedDateTime.toISOString().split('T')[0]
      await onSubmit({
        gold_type: formData.gold_type,
        unit: formData.unit,
        date: dateStr,
        created_at: selectedDateTime.toISOString(),
        price: formData.gold_type === 'world' ? parseFloat(formData.price) : null,
        buying_price: formData.gold_type !== 'world' ? parseFloat(formData.buying_price) : null,
        selling_price: formData.gold_type !== 'world' ? parseFloat(formData.selling_price) : null,
      })
    } finally {
      setLoading(false)
    }
  }

  const isWorldGold = formData.gold_type === 'world'
  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 focus:outline-none transition-colors"
  const labelClass = "block text-sm font-medium text-slate-300 mb-2"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="gold_type" className={labelClass}>Gold Type</label>
          <select id="gold_type" name="gold_type" value={formData.gold_type} onChange={handleChange} className={inputClass}>
            <option value="world">World Gold</option>
            <option value="16pae_old">16 Pae (Old)</option>
            <option value="15pae_old">15 Pae (Old)</option>
            <option value="16pae_new">16 Pae (New)</option>
            <option value="15pae_new">15 Pae (New)</option>
          </select>
        </div>
        <div>
          <label htmlFor="unit" className={labelClass}>Unit</label>
          <input type="text" value={formData.unit} disabled className={`${inputClass} bg-slate-800 cursor-not-allowed`} />
        </div>
      </div>

      {isWorldGold ? (
        <div>
          <label htmlFor="price" className={labelClass}>Price (USD/oz)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
            placeholder="0.00"
            className={inputClass}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="buying_price" className={labelClass}>Buy Price (MMK)</label>
            <input
              type="number"
              id="buying_price"
              name="buying_price"
              value={formData.buying_price}
              onChange={handleChange}
              step="1"
              required
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="selling_price" className={labelClass}>Sell Price (MMK)</label>
            <input
              type="number"
              id="selling_price"
              name="selling_price"
              value={formData.selling_price}
              onChange={handleChange}
              step="1"
              required
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>
      )}

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
          className="flex-1 py-3 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {loading ? 'Saving...' : gold ? 'Update' : 'Add Gold Price'}
        </button>
      </div>
    </form>
  )
}

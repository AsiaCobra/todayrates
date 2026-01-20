import { useState, useEffect } from 'react'

export default function GoldForm({ gold, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    gold_type: 'world',
    unit: 'oz',
    price: '',
    buying_price: '',
    selling_price: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (gold) {
      setFormData({
        gold_type: gold.gold_type || 'world',
        unit: gold.unit || 'oz',
        price: gold.price || '',
        buying_price: gold.buying_price || '',
        selling_price: gold.selling_price || '',
        date: gold.date || new Date().toISOString().split('T')[0],
      })
    }
  }, [gold])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Auto-set unit based on gold type
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
      const data = {
        gold_type: formData.gold_type,
        unit: formData.unit,
        date: formData.date,
        price: formData.gold_type === 'world' ? parseFloat(formData.price) : null,
        buying_price: formData.gold_type !== 'world' ? parseFloat(formData.buying_price) : null,
        selling_price: formData.gold_type !== 'world' ? parseFloat(formData.selling_price) : null,
      }
      await onSubmit(data)
    } finally {
      setLoading(false)
    }
  }

  const isWorldGold = formData.gold_type === 'world'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="gold_type" className="block text-sm font-medium text-gray-700">
            Gold Type
          </label>
          <select
            id="gold_type"
            name="gold_type"
            value={formData.gold_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          >
            <option value="world">World Gold (International)</option>
            <option value="16pae_old">16 ပဲရည် (စနစ်ဟောင်း) - Old System</option>
            <option value="15pae_old">15 ပဲရည် (စနစ်ဟောင်း) - Old System</option>
            <option value="16pae_new">16 ပဲရည် (စနစ်သစ်) - New System</option>
            <option value="15pae_new">15 ပဲရည် (စနစ်သစ်) - New System</option>
          </select>
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
            Unit
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={formData.unit}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border px-3 py-2 bg-gray-100"
          />
        </div>

        {isWorldGold ? (
          <div className="sm:col-span-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (USD per oz)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
              placeholder="e.g., 4673.56"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
            />
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="buying_price" className="block text-sm font-medium text-gray-700">
                ဝယ်ဈေး - Buying Price (MMK)
              </label>
              <input
                type="number"
                id="buying_price"
                name="buying_price"
                value={formData.buying_price}
                onChange={handleChange}
                step="1"
                required
                placeholder="e.g., 4850000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700">
                ရောင်းဈေး - Selling Price (MMK)
              </label>
              <input
                type="number"
                id="selling_price"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleChange}
                step="1"
                required
                placeholder="e.g., 4950000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
              />
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : gold ? 'Update Gold Price' : 'Add Gold Price'}
        </button>
      </div>
    </form>
  )
}

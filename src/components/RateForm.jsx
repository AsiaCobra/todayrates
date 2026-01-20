import { useState, useEffect } from 'react'

export default function RateForm({ rate, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    currency_from: 'USD',
    currency_to: 'MMK',
    buying_rate: '',
    selling_rate: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (rate) {
      setFormData({
        currency_from: rate.currency_from || 'USD',
        currency_to: rate.currency_to || 'MMK',
        buying_rate: rate.buying_rate || '',
        selling_rate: rate.selling_rate || '',
        date: rate.date || new Date().toISOString().split('T')[0],
      })
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
      await onSubmit({
        ...formData,
        buying_rate: parseFloat(formData.buying_rate),
        selling_rate: parseFloat(formData.selling_rate),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="currency_from" className="block text-sm font-medium text-gray-700">
            Currency From
          </label>
          <select
            id="currency_from"
            name="currency_from"
            value={formData.currency_from}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="SGD">SGD - Singapore Dollar</option>
            <option value="THB">THB - Thai Baht</option>
            <option value="CNY">CNY - Chinese Yuan</option>
            <option value="MYR">MYR - Malaysian Ringgit</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </select>
        </div>

        <div>
          <label htmlFor="currency_to" className="block text-sm font-medium text-gray-700">
            Currency To
          </label>
          <select
            id="currency_to"
            name="currency_to"
            value={formData.currency_to}
            onChange={handleChange}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2 bg-gray-100"
          >
            <option value="MMK">MMK - Myanmar Kyat</option>
          </select>
        </div>

        <div>
          <label htmlFor="buying_rate" className="block text-sm font-medium text-gray-700">
            Buying Rate
          </label>
          <input
            type="number"
            id="buying_rate"
            name="buying_rate"
            value={formData.buying_rate}
            onChange={handleChange}
            step="0.01"
            required
            placeholder="e.g., 2095"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="selling_rate" className="block text-sm font-medium text-gray-700">
            Selling Rate
          </label>
          <input
            type="number"
            id="selling_rate"
            name="selling_rate"
            value={formData.selling_rate}
            onChange={handleChange}
            step="0.01"
            required
            placeholder="e.g., 2105"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
        </div>

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
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : rate ? 'Update Rate' : 'Add Rate'}
        </button>
      </div>
    </form>
  )
}

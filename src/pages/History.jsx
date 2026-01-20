import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import RateTable from '../components/RateTable'

export default function History() {
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateFilter, setDateFilter] = useState('')
  const [currencyFilter, setCurrencyFilter] = useState('')

  useEffect(() => {
    fetchRates()
  }, [dateFilter, currencyFilter])

  const fetchRates = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('exchange_rates')
        .select('*')
        .order('date', { ascending: false })
        .order('currency_from', { ascending: true })

      if (dateFilter) {
        query = query.eq('date', dateFilter)
      }

      if (currencyFilter) {
        query = query.eq('currency_from', currencyFilter)
      }

      const { data, error } = await query.limit(100)

      if (error) throw error
      setRates(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setDateFilter('')
    setCurrencyFilter('')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate History</h1>
        <p className="text-gray-500">View historical exchange rates</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              id="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Currency
            </label>
            <select
              id="currency"
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
            >
              <option value="">All Currencies</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="SGD">SGD - Singapore Dollar</option>
              <option value="THB">THB - Thai Baht</option>
              <option value="CNY">CNY - Chinese Yuan</option>
              <option value="MYR">MYR - Malaysian Ringgit</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Error loading rates: {error}</p>
          <button
            onClick={fetchRates}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <RateTable rates={rates} />
        </div>
      )}
    </div>
  )
}

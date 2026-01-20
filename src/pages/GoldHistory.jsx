import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import GoldTable from '../components/GoldTable'

export default function GoldHistory() {
  const [goldPrices, setGoldPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateFilter, setDateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    fetchGoldPrices()
  }, [dateFilter, typeFilter])

  const fetchGoldPrices = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('gold_prices')
        .select('*')
        .order('date', { ascending: false })
        .order('gold_type', { ascending: true })

      if (dateFilter) {
        query = query.eq('date', dateFilter)
      }

      if (typeFilter) {
        query = query.eq('gold_type', typeFilter)
      }

      const { data, error } = await query.limit(100)

      if (error) throw error
      setGoldPrices(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setDateFilter('')
    setTypeFilter('')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gold Price History</h1>
        <p className="text-gray-500">View historical gold prices / ရွှေဈေးနှုန်း မှတ်တမ်း</p>
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm border px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Gold Type
            </label>
            <select
              id="type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm border px-3 py-2"
            >
              <option value="">All Types</option>
              <option value="world">World Gold</option>
              <option value="16pae_old">16 ပဲရည် (စနစ်ဟောင်း) - Old</option>
              <option value="15pae_old">15 ပဲရည် (စနစ်ဟောင်း) - Old</option>
              <option value="16pae_new">16 ပဲရည် (စနစ်သစ်) - New</option>
              <option value="15pae_new">15 ပဲရည် (စနစ်သစ်) - New</option>
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
          <p className="text-red-600">Error loading gold prices: {error}</p>
          <button
            onClick={fetchGoldPrices}
            className="mt-2 text-sm text-amber-600 hover:text-amber-800"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <GoldTable goldPrices={goldPrices} />
        </div>
      )}
    </div>
  )
}

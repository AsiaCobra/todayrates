import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import RateForm from '../components/RateForm'
import RateTable from '../components/RateTable'
import GoldForm from '../components/GoldForm'
import GoldTable from '../components/GoldTable'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('rates')
  const [rates, setRates] = useState([])
  const [goldPrices, setGoldPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingRate, setEditingRate] = useState(null)
  const [editingGold, setEditingGold] = useState(null)
  const [showRateForm, setShowRateForm] = useState(false)
  const [showGoldForm, setShowGoldForm] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [ratesResult, goldResult] = await Promise.all([
        supabase
          .from('exchange_rates')
          .select('*')
          .order('date', { ascending: false })
          .order('currency_from', { ascending: true })
          .limit(50),
        supabase
          .from('gold_prices')
          .select('*')
          .order('date', { ascending: false })
          .order('gold_type', { ascending: true })
          .limit(50)
      ])

      if (ratesResult.error) throw ratesResult.error
      if (goldResult.error) throw goldResult.error

      setRates(ratesResult.data || [])
      setGoldPrices(goldResult.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Exchange Rate handlers
  const handleRateSubmit = async (formData) => {
    try {
      setError(null)

      if (editingRate) {
        const { error } = await supabase
          .from('exchange_rates')
          .update({ ...formData, updated_by: user.id })
          .eq('id', editingRate.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('exchange_rates')
          .insert({ ...formData, updated_by: user.id })
        if (error) throw error
      }

      setShowRateForm(false)
      setEditingRate(null)
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRateEdit = (rate) => {
    setEditingRate(rate)
    setShowRateForm(true)
  }

  const handleRateDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rate?')) return

    try {
      setError(null)
      const { error } = await supabase.from('exchange_rates').delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  // Gold Price handlers
  const handleGoldSubmit = async (formData) => {
    try {
      setError(null)

      if (editingGold) {
        const { error } = await supabase
          .from('gold_prices')
          .update({ ...formData, updated_by: user.id })
          .eq('id', editingGold.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('gold_prices')
          .insert({ ...formData, updated_by: user.id })
        if (error) throw error
      }

      setShowGoldForm(false)
      setEditingGold(null)
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoldEdit = (gold) => {
    setEditingGold(gold)
    setShowGoldForm(true)
  }

  const handleGoldDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gold price?')) return

    try {
      setError(null)
      const { error } = await supabase.from('gold_prices').delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) return null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">Manage exchange rates and gold prices</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => { setActiveTab('rates'); setShowRateForm(false); setShowGoldForm(false); }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rates'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            💱 Exchange Rates
          </button>
          <button
            onClick={() => { setActiveTab('gold'); setShowRateForm(false); setShowGoldForm(false); }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'gold'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🪙 Gold Prices
          </button>
        </nav>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Exchange Rates Tab */}
          {activeTab === 'rates' && (
            <div>
              <div className="flex justify-end mb-4">
                {!showRateForm && (
                  <button
                    onClick={() => { setEditingRate(null); setShowRateForm(true); }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Exchange Rate
                  </button>
                )}
              </div>

              {showRateForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingRate ? 'Edit Exchange Rate' : 'Add New Exchange Rate'}
                  </h2>
                  <RateForm
                    rate={editingRate}
                    onSubmit={handleRateSubmit}
                    onCancel={() => { setShowRateForm(false); setEditingRate(null); }}
                  />
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <RateTable
                  rates={rates}
                  isAdmin={true}
                  onEdit={handleRateEdit}
                  onDelete={handleRateDelete}
                />
              </div>
            </div>
          )}

          {/* Gold Prices Tab */}
          {activeTab === 'gold' && (
            <div>
              <div className="flex justify-end mb-4">
                {!showGoldForm && (
                  <button
                    onClick={() => { setEditingGold(null); setShowGoldForm(true); }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Gold Price
                  </button>
                )}
              </div>

              {showGoldForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-amber-500">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingGold ? 'Edit Gold Price' : 'Add New Gold Price'}
                  </h2>
                  <GoldForm
                    gold={editingGold}
                    onSubmit={handleGoldSubmit}
                    onCancel={() => { setShowGoldForm(false); setEditingGold(null); }}
                  />
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <GoldTable
                  goldPrices={goldPrices}
                  isAdmin={true}
                  onEdit={handleGoldEdit}
                  onDelete={handleGoldDelete}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

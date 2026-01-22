import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Select from 'react-select'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import RateForm from '../components/RateForm'
import RateTable from '../components/RateTable'
import GoldForm from '../components/GoldForm'
import GoldTable from '../components/GoldTable'
import Modal from '../components/Modal'
import { CURRENCY_ORDER, getCurrencyMeta } from '../lib/currencies'
import { generateAllRates, generateExchangeRates, generateGoldPrice } from '../lib/autoGenerateRates'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('rates')
  const [rates, setRates] = useState([])
  const [goldPrices, setGoldPrices] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [editingRate, setEditingRate] = useState(null)
  const [editingGold, setEditingGold] = useState(null)
  const [showRateForm, setShowRateForm] = useState(false)
  const [showGoldForm, setShowGoldForm] = useState(false)
  const [showRateFilters, setShowRateFilters] = useState(false)
  const [showGoldFilters, setShowGoldFilters] = useState(false)
  const [hasMoreRates, setHasMoreRates] = useState(false)
  const [hasMoreGold, setHasMoreGold] = useState(false)
  const [ratesPage, setRatesPage] = useState(1)
  const [goldPage, setGoldPage] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [generateSuccess, setGenerateSuccess] = useState(null)
  const [apiPrices, setApiPrices] = useState({ usd: null, gold: null, loading: false })
  
  // Filter states
  const [rateFilters, setRateFilters] = useState({
    currency: '',
    startDate: '',
    endDate: ''
  })
  const [goldFilters, setGoldFilters] = useState({
    goldType: '',
    startDate: '',
    endDate: ''
  })
  
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const PER_PAGE = parseInt(import.meta.env.VITE_HISTORY_PER_PAGE || '50')
  
  // Currency options for react-select
  const currencyOptions = [
    { value: '', label: 'All Currencies' },
    ...CURRENCY_ORDER.map(code => {
      const currency = getCurrencyMeta(code)
      return {
        value: code,
        label: `${currency.flag} ${code} - ${currency.name}`
      }
    })
  ]
  
  // Gold type options for react-select
  const goldTypeOptions = [
    { value: '', label: 'All Gold Types' },
    { value: 'world', label: 'World Gold' },
    { value: '16pae_old', label: '16 Pae (Old)' },
    { value: '15pae_old', label: '15 Pae (Old)' },
    { value: '16pae_new', label: '16 Pae (New)' },
    { value: '15pae_new', label: '15 Pae (New)' }
  ]
  
  // Custom styles for react-select (dark theme)
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: '#1e293b',
      borderColor: state.isFocused ? '#3b82f6' : '#334155',
      borderRadius: '0.5rem',
      padding: '0.125rem',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    }),
    menuList: (base) => ({
      ...base,
      padding: 0
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#334155' : '#1e293b',
      color: state.isSelected ? '#fff' : '#cbd5e1',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#3b82f6'
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: '#cbd5e1'
    }),
    input: (base) => ({
      ...base,
      color: '#cbd5e1'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#64748b'
    })
  }
  
  const goldSelectStyles = {
    ...selectStyles,
    control: (base, state) => ({
      ...base,
      backgroundColor: '#1e293b',
      borderColor: state.isFocused ? '#eab308' : '#334155',
      borderRadius: '0.5rem',
      padding: '0.125rem',
      boxShadow: state.isFocused ? '0 0 0 1px #eab308' : 'none',
      '&:hover': {
        borderColor: '#eab308'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#eab308' : state.isFocused ? '#334155' : '#1e293b',
      color: state.isSelected ? '#0f172a' : '#cbd5e1',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#eab308'
      }
    })
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
    fetchApiPrices() // Fetch API prices on load
  }, [user, navigate, rateFilters, goldFilters])

  const buildRatesQuery = () => {
    let query = supabase
      .from('exchange_rates')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (rateFilters.currency) {
      query = query.eq('currency_from', rateFilters.currency)
    }
    if (rateFilters.startDate) {
      query = query.gte('date', rateFilters.startDate)
    }
    if (rateFilters.endDate) {
      query = query.lte('date', rateFilters.endDate)
    }
    
    return query
  }
  
  const buildGoldQuery = () => {
    let query = supabase
      .from('gold_prices')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (goldFilters.goldType) {
      query = query.eq('gold_type', goldFilters.goldType)
    }
    if (goldFilters.startDate) {
      query = query.gte('date', goldFilters.startDate)
    }
    if (goldFilters.endDate) {
      query = query.lte('date', goldFilters.endDate)
    }
    
    return query
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [ratesResult, goldResult, contactsResult] = await Promise.all([
        buildRatesQuery().range(0, PER_PAGE - 1),
        buildGoldQuery().range(0, PER_PAGE - 1),
        supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false })
          .range(0, PER_PAGE - 1)
      ])

      if (ratesResult.error) throw ratesResult.error
      if (goldResult.error) throw goldResult.error
      if (contactsResult.error) throw contactsResult.error

      setRates(ratesResult.data || [])
      setGoldPrices(goldResult.data || [])
      setContacts(contactsResult.data || [])
      
      // Check if there's more data
      setHasMoreRates(ratesResult.data?.length === PER_PAGE)
      setHasMoreGold(goldResult.data?.length === PER_PAGE)
      
      setRatesPage(1)
      setGoldPage(1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreRates = async () => {
    try {
      setLoadingMore(true)
      const nextPage = ratesPage + 1
      const from = nextPage * PER_PAGE
      const to = from + PER_PAGE - 1

      const { data, error } = await buildRatesQuery().range(from, to)

      if (error) throw error

      setRates([...rates, ...(data || [])])
      setHasMoreRates(data?.length === PER_PAGE)
      setRatesPage(nextPage)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingMore(false)
    }
  }

  const loadMoreGold = async () => {
    try {
      setLoadingMore(true)
      const nextPage = goldPage + 1
      const from = nextPage * PER_PAGE
      const to = from + PER_PAGE - 1

      const { data, error } = await buildGoldQuery().range(from, to)

      if (error) throw error

      setGoldPrices([...goldPrices, ...(data || [])])
      setHasMoreGold(data?.length === PER_PAGE)
      setGoldPage(nextPage)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingMore(false)
    }
  }

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
    if (!window.confirm('Delete this rate?')) return
    try {
      setError(null)
      const { error } = await supabase.from('exchange_rates').delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

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
    if (!window.confirm('Delete this gold price?')) return
    try {
      setError(null)
      const { error } = await supabase.from('gold_prices').delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleContactDelete = async (id) => {
    if (!window.confirm('Delete this contact message?')) return
    try {
      setError(null)
      const { error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleContactStatusToggle = async (id, currentStatus) => {
    try {
      setError(null)
      const newStatus = currentStatus === 'unread' ? 'read' : 'unread'
      const { error } = await supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleAutoGenerate = async () => {
    if (!window.confirm('Generate today\'s exchange rates and gold price automatically?\n\nThis will fetch current rates from external APIs and create new entries.')) {
      return
    }

    try {
      setGenerating(true)
      setError(null)
      setGenerateSuccess(null)

      const result = await generateAllRates(user.id)

      if (result.rates.success && result.gold.success) {
        setGenerateSuccess(`Successfully generated ${result.rates.count} exchange rates and gold price!`)
        fetchData() // Refresh data
        fetchApiPrices() // Refresh API prices
      } else {
        const errors = []
        if (!result.rates.success) errors.push(`Rates: ${result.rates.error}`)
        if (!result.gold.success) errors.push(`Gold: ${result.gold.error}`)
        throw new Error(errors.join('; '))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
      // Clear success message after 5 seconds
      setTimeout(() => setGenerateSuccess(null), 5000)
    }
  }

  const fetchApiPrices = async () => {
    try {
      setApiPrices(prev => ({ ...prev, loading: true }))
      
      // Fetch both APIs in parallel
      const [moneyConvertResponse, goldApiResponse] = await Promise.all([
        fetch('https://cdn.moneyconvert.net/api/latest.json'),
        fetch('https://api.gold-api.com/price/XAU')
      ])

      let usdRate = null
      let goldPrice = null

      if (moneyConvertResponse.ok) {
        const data = await moneyConvertResponse.json()
        usdRate = data.rates?.MMK || null
      }

      if (goldApiResponse.ok) {
        const data = await goldApiResponse.json()
        goldPrice = data.price || null
      }

      setApiPrices({
        usd: usdRate,
        gold: goldPrice,
        loading: false,
        lastFetched: new Date()
      })
    } catch (err) {
      console.error('Error fetching API prices:', err)
      setApiPrices(prev => ({ ...prev, loading: false }))
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-gold-gradient">Admin</span> Panel
          </h1>
          <p className="text-sm text-slate-500">Manage rates and prices</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-slate-400 hover:text-white">
            ← Back
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('rates'); setShowRateForm(false); setShowGoldForm(false); }}
          className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'rates'
              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
          }`}
        >
          Exchange Rates
        </button>
        <button
          onClick={() => { setActiveTab('gold'); setShowRateForm(false); setShowGoldForm(false); }}
          className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'gold'
              ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
          }`}
        >
          Gold Prices
        </button>
        <button
          onClick={() => { setActiveTab('contacts'); setShowRateForm(false); setShowGoldForm(false); }}
          className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'contacts'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
          }`}
        >
          Contacts
        </button>
      </div>

      {/* API Prices Display */}
      {(activeTab === 'rates' || activeTab === 'gold') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {/* USD Price from API */}
          {activeTab === 'rates' && (
            <div className="glass-card rounded-xl p-4 border border-cyan-500/30 bg-cyan-500/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-cyan-400">USD to MMK (API)</h3>
                </div>
                <button
                  onClick={fetchApiPrices}
                  disabled={apiPrices.loading}
                  className="text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                >
                  {apiPrices.loading ? '↻' : '🔄'}
                </button>
              </div>
              {apiPrices.loading ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-500/30 border-t-cyan-400 animate-spin"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              ) : apiPrices.usd ? (
                <div>
                  <p className="text-2xl font-bold text-cyan-400 mb-1">{apiPrices.usd.toFixed(8)}</p>
                  <p className="text-xs text-slate-500">
                    {apiPrices.lastFetched && `Updated: ${new Date(apiPrices.lastFetched).toLocaleTimeString()}`}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-700">
                    <p className="text-xs text-slate-400 mb-1">Black Market Rates:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-emerald-400">Buy: {(apiPrices.usd * 1.8887).toFixed(2)} MMK</p>
                      </div>
                      <div>
                        <p className="text-xs text-rose-400">Sell: {(apiPrices.usd * 1.9381).toFixed(2)} MMK</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-rose-400">Failed to fetch USD rate</p>
              )}
            </div>
          )}

          {/* Gold Price from API */}
          {activeTab === 'gold' && (
            <div className="glass-card rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-yellow-400">World Gold Price (API)</h3>
                </div>
                <button
                  onClick={fetchApiPrices}
                  disabled={apiPrices.loading}
                  className="text-xs text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
                >
                  {apiPrices.loading ? '↻' : '🔄'}
                </button>
              </div>
              {apiPrices.loading ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-500/30 border-t-yellow-400 animate-spin"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              ) : apiPrices.gold ? (
                <div>
                  <p className="text-2xl font-bold text-yellow-400 mb-1">${apiPrices.gold.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mb-2">Per troy ounce (oz)</p>
                  <p className="text-xs text-slate-500">
                    {apiPrices.lastFetched && `Updated: ${new Date(apiPrices.lastFetched).toLocaleTimeString()}`}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-700">
                    <p className="text-xs text-slate-400">Per gram: ${(apiPrices.gold / 31.1035).toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-rose-400">Failed to fetch gold price</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Success */}
      {generateSuccess && (
        <div className="glass-card rounded-xl p-4 mb-6 border border-emerald-500/30 bg-emerald-500/10">
          <p className="text-sm text-emerald-400">{generateSuccess}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass-card rounded-xl p-4 mb-6 border border-rose-500/30 bg-rose-500/10">
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      ) : (
        <>
          {/* Exchange Rates Tab */}
          {activeTab === 'rates' && (
            <div className="space-y-4">
              {/* Auto-Generate Section */}
              <div className="glass-card rounded-xl p-4 border border-purple-500/30 bg-purple-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-1">Auto-Generate Rates</h3>
                    <p className="text-xs text-slate-400">
                      Fetch current rates from external APIs and generate today's exchange rates
                    </p>
                  </div>
                  <button
                    onClick={handleAutoGenerate}
                    disabled={generating}
                    className="py-2.5 px-4 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {generating ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingRate(null); setShowRateForm(true); }}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Exchange Rate
                </button>
                
                <button
                  onClick={() => setShowRateFilters(true)}
                  className="py-3 px-4 rounded-xl font-medium text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 relative"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                  {(rateFilters.currency || rateFilters.startDate || rateFilters.endDate) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                  )}
                </button>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden">
                <RateTable
                  rates={rates}
                  isAdmin={true}
                  onEdit={handleRateEdit}
                  onDelete={handleRateDelete}
                />
              </div>

              {/* Load More Button */}
              {hasMoreRates && (
                <button
                  onClick={loadMoreRates}
                  disabled={loadingMore}
                  className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-500/30 border-t-slate-300 animate-spin"></div>
                      <span>Loading more...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>Load More ({rates.length} loaded)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Gold Prices Tab */}
          {activeTab === 'gold' && (
            <div className="space-y-4">
              {/* Auto-Generate Section */}
              <div className="glass-card rounded-xl p-4 border border-purple-500/30 bg-purple-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-1">Auto-Generate Gold Price</h3>
                    <p className="text-xs text-slate-400">
                      Fetch current world gold price (XAU) from external API
                    </p>
                  </div>
                  <button
                    onClick={handleAutoGenerate}
                    disabled={generating}
                    className="py-2.5 px-4 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {generating ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingGold(null); setShowGoldForm(true); }}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Gold Price
                </button>
                
                <button
                  onClick={() => setShowGoldFilters(true)}
                  className="py-3 px-4 rounded-xl font-medium text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 relative"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                  {(goldFilters.goldType || goldFilters.startDate || goldFilters.endDate) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></span>
                  )}
                </button>
              </div>


              <div className="glass-card rounded-2xl overflow-hidden">
                <GoldTable
                  goldPrices={goldPrices}
                  isAdmin={true}
                  onEdit={handleGoldEdit}
                  onDelete={handleGoldDelete}
                />
              </div>

              {/* Load More Button */}
              {hasMoreGold && (
                <button
                  onClick={loadMoreGold}
                  disabled={loadingMore}
                  className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-500/30 border-t-slate-300 animate-spin"></div>
                      <span>Loading more...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>Load More ({goldPrices.length} loaded)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">Email</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">Subject</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">Message</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">Status</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {contacts.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                            No contact messages yet
                          </td>
                        </tr>
                      ) : (
                        contacts.map((contact) => (
                          <tr key={contact.id} className="hover:bg-slate-800/30">
                            <td className="px-4 py-3 text-slate-300">{contact.name}</td>
                            <td className="px-4 py-3 text-slate-300">{contact.email}</td>
                            <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{contact.subject}</td>
                            <td className="px-4 py-3 text-slate-400 max-w-md truncate text-xs">{contact.message}</td>
                            <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                              {new Date(contact.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleContactStatusToggle(contact.id, contact.status)}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  contact.status === 'unread'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-slate-700 text-slate-400'
                                }`}
                              >
                                {contact.status === 'unread' ? 'Unread' : 'Read'}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleContactDelete(contact.id)}
                                className="text-rose-400 hover:text-rose-300 text-xs"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Rate Modal */}
      <Modal
        isOpen={showRateForm}
        onClose={() => { setShowRateForm(false); setEditingRate(null); }}
        title={editingRate ? 'Edit Exchange Rate' : 'Add Exchange Rate'}
      >
        <RateForm
          rate={editingRate}
          onSubmit={handleRateSubmit}
          onCancel={() => { setShowRateForm(false); setEditingRate(null); }}
        />
      </Modal>

      {/* Gold Modal */}
      <Modal
        isOpen={showGoldForm}
        onClose={() => { setShowGoldForm(false); setEditingGold(null); }}
        title={editingGold ? 'Edit Gold Price' : 'Add Gold Price'}
      >
        <GoldForm
          gold={editingGold}
          onSubmit={handleGoldSubmit}
          onCancel={() => { setShowGoldForm(false); setEditingGold(null); }}
        />
      </Modal>
      
      {/* Rate Filters Modal */}
      <Modal
        isOpen={showRateFilters}
        onClose={() => setShowRateFilters(false)}
        title="Filter Exchange Rates"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Currency</label>
            <Select
              value={currencyOptions.find(opt => opt.value === rateFilters.currency)}
              onChange={(option) => setRateFilters({ ...rateFilters, currency: option.value })}
              options={currencyOptions}
              styles={selectStyles}
              isSearchable
              placeholder="All Currencies"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Start Date</label>
            <input
              type="date"
              value={rateFilters.startDate}
              onChange={(e) => setRateFilters({ ...rateFilters, startDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">End Date</label>
            <input
              type="date"
              value={rateFilters.endDate}
              onChange={(e) => setRateFilters({ ...rateFilters, endDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            {(rateFilters.currency || rateFilters.startDate || rateFilters.endDate) && (
              <button
                onClick={() => setRateFilters({ currency: '', startDate: '', endDate: '' })}
                className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium bg-slate-800 text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => setShowRateFilters(false)}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 transition-opacity"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Gold Filters Modal */}
      <Modal
        isOpen={showGoldFilters}
        onClose={() => setShowGoldFilters(false)}
        title="Filter Gold Prices"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Gold Type</label>
            <Select
              value={goldTypeOptions.find(opt => opt.value === goldFilters.goldType)}
              onChange={(option) => setGoldFilters({ ...goldFilters, goldType: option.value })}
              options={goldTypeOptions}
              styles={goldSelectStyles}
              isSearchable
              placeholder="All Gold Types"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Start Date</label>
            <input
              type="date"
              value={goldFilters.startDate}
              onChange={(e) => setGoldFilters({ ...goldFilters, startDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">End Date</label>
            <input
              type="date"
              value={goldFilters.endDate}
              onChange={(e) => setGoldFilters({ ...goldFilters, endDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            {(goldFilters.goldType || goldFilters.startDate || goldFilters.endDate) && (
              <button
                onClick={() => setGoldFilters({ goldType: '', startDate: '', endDate: '' })}
                className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium bg-slate-800 text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => setShowGoldFilters(false)}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 hover:opacity-90 transition-opacity"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

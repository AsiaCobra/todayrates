import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrencyMeta, CURRENCY_ORDER } from '../lib/currencies'
import SEO from '../components/SEO'

// Format number with 2 decimal places
const formatNumber = (num, decimals = 2) => {
  if (!num) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

// Change badge
const ChangeBadge = ({ value }) => {
  if (!value || value === 0) return null
  const isPositive = value > 0
  return (
    <span className={`inline-flex items-center text-xs font-medium ${
      isPositive ? 'text-emerald-400' : 'text-rose-400'
    }`}>
      {isPositive ? '↑' : '↓'} {formatNumber(Math.abs(value), value < 10 ? 2 : 0)}
    </span>
  )
}

// Currency Card with multiple time entries
const CurrencyCard = ({ code, ratesData }) => {
  const meta = getCurrencyMeta(code)

  return (
    <Link
      to={`/currency-history/${code}`}
      className="glass-card glass-card-hover rounded-xl p-4 transition-all block"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">
            {meta.flag}
          </div>
          <div>
            <p className="font-semibold">{code}</p>
            <p className="text-xs text-slate-500">{meta.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ratesData.length > 1 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              {ratesData.length} updates
            </span>
          )}
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Rate entries stacked vertically */}
      <div className="space-y-2">
        {ratesData.map((rate, index) => (
          <div key={rate.id} className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500">
                {new Date(rate.created_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
              {index === 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Latest
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Buy</p>
                <p className="text-base font-semibold tabular-nums text-emerald-400">
                  {formatNumber(rate.buying_rate)}
                </p>
                {index === 0 && <ChangeBadge value={rate.buyChange} />}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Sell</p>
                <p className="text-base font-semibold tabular-nums text-rose-400">
                  {formatNumber(rate.selling_rate)}
                </p>
                {index === 0 && <ChangeBadge value={rate.sellChange} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Link>
  )
}

export default function Currency() {
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchRates()
  }, [])

  const fetchRates = async () => {
    try {
      setLoading(true)

      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const dayBeforeYesterday = new Date(Date.now() - 172800000).toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .in('date', [today, yesterday, dayBeforeYesterday])
        .order('created_at', { ascending: false })

      if (error) throw error

      const todayData = data?.filter(d => d.date === today) || []
      const yesterdayData = data?.filter(d => d.date === yesterday) || []
      const dayBeforeYesterdayData = data?.filter(d => d.date === dayBeforeYesterday) || []

      // If today's data is empty, use yesterday's data
      const displayData = todayData.length > 0 ? todayData : yesterdayData
      const isUsingYesterdayData = todayData.length === 0 && yesterdayData.length > 0

      if (displayData.length > 0) {
        setLastUpdated(displayData[0].created_at)
      }

      // Group by currency code and keep all display data rates
      const groupedByCurrency = displayData.reduce((acc, rate) => {
        if (!acc[rate.currency_from]) {
          acc[rate.currency_from] = []
        }
        acc[rate.currency_from].push(rate)
        return acc
      }, {})

      // Process each currency group
      const ratesGrouped = Object.entries(groupedByCurrency).map(([currencyCode, rates]) => {
        // Sort by time (most recent first)
        rates.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        
        // Get comparison rate (yesterday or day before yesterday)
        const compareRate = isUsingYesterdayData
          ? dayBeforeYesterdayData.find(y => y.currency_from === currencyCode)
          : yesterdayData.find(y => y.currency_from === currencyCode)
        
        // Add change info to each rate
        const ratesWithChanges = rates.map(rate => ({
          ...rate,
          buyChange: compareRate ? rate.buying_rate - compareRate.buying_rate : 0,
          sellChange: compareRate ? rate.selling_rate - compareRate.selling_rate : 0,
        }))

        return {
          currency: currencyCode,
          rates: ratesWithChanges
        }
      })

      // Sort by predefined order
      ratesGrouped.sort((a, b) => {
        const aIndex = CURRENCY_ORDER.indexOf(a.currency)
        const bIndex = CURRENCY_ORDER.indexOf(b.currency)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })

      setRates(ratesGrouped)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin"></div>
        <p className="text-slate-400 text-sm">Loading currencies...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-rose-400">Error: {error}</p>
        <button onClick={fetchRates} className="mt-3 text-yellow-400 text-sm hover:underline">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SEO 
        title="Currency Exchange Rates - Today Rates"
        description="Real-time currency exchange rates for 38 currencies in Myanmar. Get latest USD, EUR, SGD, THB, CNY exchange rates to MMK updated daily."
        keywords="currency exchange rates, Myanmar exchange rates, USD to MMK, EUR to MMK, foreign exchange, forex rates Myanmar"
        url="/currency"
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-gold-gradient">Currency</span> Rates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {lastUpdated
              ? `Updated ${new Date(lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
              : 'Exchange rates to MMK'
            }
          </p>
        </div>
      </div>

      {/* Currency Grid */}
      {rates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rates.map((rateGroup) => (
            <CurrencyCard
              key={rateGroup.currency}
              code={rateGroup.currency}
              ratesData={rateGroup.rates}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-slate-400">No exchange rates available</p>
        </div>
      )}
    </div>
  )
}

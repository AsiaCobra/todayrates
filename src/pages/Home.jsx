import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrencyMeta } from '../lib/currencies'
import SEO from '../components/SEO'

// Format number with commas
const formatNumber = (num, decimals = 0) => {
  if (!num) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

// Change badge component
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

// Featured rate card
const FeaturedCard = ({ title, subtitle, value, unit, change, icon, gradient }) => (
  <div className={`glass-card glass-card-hover rounded-2xl p-5 transition-all duration-300 ${gradient}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm">{subtitle}</p>
        <h3 className="text-lg font-semibold mt-1">{title}</h3>
      </div>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 flex items-center justify-center text-yellow-400">
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums">{value}</span>
        <span className="text-slate-400 text-sm">{unit}</span>
      </div>
      <div className="mt-1">
        <ChangeBadge value={change} />
      </div>
    </div>
  </div>
)

// Quick rate row
const QuickRateRow = ({ code, name, flag, buyRate, sellRate, change }) => (
  <Link
    to={`/currency-history/${code}`}
    className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 -mx-4 px-4 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-lg">
        {flag}
      </div>
      <div>
        <p className="font-medium text-sm">{code}</p>
        <p className="text-xs text-slate-500">{name}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="space-y-0.5">
        <p className="text-xs text-slate-500">Buy: <span className="font-semibold text-slate-300 tabular-nums">{formatNumber(buyRate)}</span></p>
        <p className="text-xs text-slate-500">Sell: <span className="font-semibold text-slate-300 tabular-nums">{formatNumber(sellRate)}</span></p>
      </div>
      <div className="mt-1 flex justify-end">
        <ChangeBadge value={change} />
      </div>
    </div>
  </Link>
)

export default function Home() {
  const [data, setData] = useState({ rates: [], gold: null })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

      const [ratesResult, goldResult] = await Promise.all([
        supabase
          .from('exchange_rates')
          .select('*')
          .in('date', [today, yesterday])
          .order('created_at', { ascending: false }),
        supabase
          .from('gold_prices')
          .select('*')
          .in('date', [today, yesterday])
          .order('created_at', { ascending: false }),
      ])

      const todayRates = ratesResult.data?.filter(r => r.date === today) || []
      const yesterdayRates = ratesResult.data?.filter(r => r.date === yesterday) || []
      const todayGold = goldResult.data?.filter(g => g.date === today) || []
      const yesterdayGold = goldResult.data?.filter(g => g.date === yesterday) || []

      // Get only the latest rate for each currency (deduplicate by currency_from)
      const latestRatesMap = new Map()
      todayRates.forEach(rate => {
        if (!latestRatesMap.has(rate.currency_from)) {
          latestRatesMap.set(rate.currency_from, rate)
        }
      })
      const latestTodayRates = Array.from(latestRatesMap.values())
      
      // Get latest yesterday rates for comparison
      const latestYesterdayMap = new Map()
      yesterdayRates.forEach(rate => {
        if (!latestYesterdayMap.has(rate.currency_from)) {
          latestYesterdayMap.set(rate.currency_from, rate)
        }
      })

      // Calculate changes for rates
      const ratesWithChanges = latestTodayRates.map(rate => {
        const prev = latestYesterdayMap.get(rate.currency_from)
        return {
          ...rate,
          buyChange: prev ? rate.buying_rate - prev.buying_rate : 0,
        }
      })

      // Get world gold with change
      const worldGold = todayGold.find(g => g.gold_type === 'world')
      const prevWorldGold = yesterdayGold.find(g => g.gold_type === 'world')

      setData({
        rates: ratesWithChanges,
        gold: worldGold ? {
          ...worldGold,
          priceChange: prevWorldGold ? worldGold.price - prevWorldGold.price : 0,
        } : null,
      })

      if (todayRates.length > 0 || todayGold.length > 0) {
        setLastUpdated(todayRates[0]?.created_at || todayGold[0]?.created_at)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const currencyNames = {
    USD: 'US Dollar',
    EUR: 'Euro',
    SGD: 'Singapore Dollar',
    THB: 'Thai Baht',
    CNY: 'Chinese Yuan',
    MYR: 'Malaysian Ringgit',
    JPY: 'Japanese Yen',
  }
  
  // Featured currencies to display on home
  const featuredCurrencies = ['USD', 'EUR', 'SGD', 'THB', 'CNY', 'MYR', 'JPY']

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin"></div>
        <p className="text-slate-400 text-sm">Loading rates...</p>
      </div>
    )
  }

  const usdRate = data.rates.find(r => r.currency_from === 'USD')

  return (
    <>
      <SEO />
      <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold">
          Today's <span className="text-gold-gradient">Rates</span>
        </h1>
        {lastUpdated && (
          <p className="text-sm text-slate-500 mt-1">
            Updated {new Date(lastUpdated).toLocaleString('en-US', {
              month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
            })}
          </p>
        )}
      </div>

      {/* Featured Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Gold Card */}
        <FeaturedCard
          title="Gold"
          subtitle="World Price"
          value={data.gold ? `$${formatNumber(data.gold.price, 2)}` : '—'}
          unit="/oz"
          change={data.gold?.priceChange}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
          }
        />

        {/* USD Card */}
        <FeaturedCard
          title="USD"
          subtitle="Exchange Rate"
          value={usdRate ? formatNumber(usdRate.buying_rate) : '—'}
          unit="MMK"
          change={usdRate?.buyChange}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link
          to="/gold"
          className="glass-card glass-card-hover rounded-xl p-4 flex items-center gap-3 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">Gold Prices</p>
            <p className="text-xs text-slate-500">World & Myanmar</p>
          </div>
        </Link>

        <Link
          to="/currency"
          className="glass-card glass-card-hover rounded-xl p-4 flex items-center gap-3 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M2 12h4l3-9 6 18 3-9h4" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">All Currencies</p>
            <p className="text-xs text-slate-500">View all rates</p>
          </div>
        </Link>
      </div>

      {/* Currency List */}
      {data.rates.length > 0 && (
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Exchange Rates</h2>
            <Link to="/currency" className="text-xs text-yellow-400 hover:text-yellow-300">
              View All →
            </Link>
          </div>
          <div>
            {data.rates
              .filter(rate => featuredCurrencies.includes(rate.currency_from))
              .sort((a, b) => featuredCurrencies.indexOf(a.currency_from) - featuredCurrencies.indexOf(b.currency_from))
              .map((rate) => {
                const currency = getCurrencyMeta(rate.currency_from)
                return (
                  <QuickRateRow
                    key={rate.id}
                    code={rate.currency_from}
                    name={currency.name}
                    flag={currency.flag}
                    buyRate={rate.buying_rate}
                    sellRate={rate.selling_rate}
                    change={rate.buyChange}
                  />
                )
              })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!data.gold && data.rates.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-400">No rates available today</p>
          <p className="text-sm text-slate-500 mt-1">Check back later for updates</p>
        </div>
      )}
    </div>
    </>
  )
}

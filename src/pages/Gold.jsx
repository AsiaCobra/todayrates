import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'

// Format number with 2 decimal places
const formatNumber = (num, decimals = 2) => {
  if (!num) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

// Change badge component
const ChangeBadge = ({ value, large = false }) => {
  if (!value || value === 0) return <span className="text-slate-500 text-xs">—</span>
  const isPositive = value > 0
  return (
    <span className={`inline-flex items-center font-medium ${large ? 'text-sm' : 'text-xs'} ${
      isPositive ? 'text-emerald-400' : 'text-rose-400'
    }`}>
      {isPositive ? '↑' : '↓'} {formatNumber(Math.abs(value), value < 100 ? 2 : 0)}
    </span>
  )
}

// World Gold Stats Card
const WorldGoldCard = ({ price, change, lastUpdated }) => (
  <Link to="/gold-history/world" className="block glass-card glass-card-hover rounded-2xl p-5 gold-glow transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold">World Gold</h2>
          <p className="text-xs text-slate-500">International Price</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {lastUpdated && (
          <span className="text-xs text-slate-500">
            {new Date(lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div className="text-center p-3 rounded-xl bg-slate-800/50">
        <p className="text-xs text-slate-500 mb-1">Per Ounce</p>
        <p className="text-xl font-bold text-gold-gradient">${formatNumber(price, 2)}</p>
        <ChangeBadge value={change} />
      </div>
      <div className="text-center p-3 rounded-xl bg-slate-800/50">
        <p className="text-xs text-slate-500 mb-1">Per Gram</p>
        <p className="text-lg font-semibold">${formatNumber(price / 31.1035, 2)}</p>
        <ChangeBadge value={change ? change / 31.1035 : 0} />
      </div>
      <div className="text-center p-3 rounded-xl bg-slate-800/50">
        <p className="text-xs text-slate-500 mb-1">Per Kyatthar</p>
        <p className="text-lg font-semibold">${formatNumber((price / 31.1035) * 16.6, 2)}</p>
        <ChangeBadge value={change ? (change / 31.1035) * 16.6 : 0} />
      </div>
    </div>
  </Link>
)

// Myanmar Gold Card
const MyanmarGoldCard = ({ name, subtitle, goldData, goldType }) => (
  <Link to={`/gold-history/${goldType}`} className="block glass-card glass-card-hover rounded-xl p-4 transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-600/20 flex items-center justify-center">
          <span className="text-yellow-400 font-bold text-sm">{name.slice(0, 2)}</span>
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      {goldData.length > 1 && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          {goldData.length} updates
        </span>
      )}
    </div>

    {/* Price entries stacked vertically */}
    <div className="space-y-2">
      {goldData.map((gold, index) => (
        <div key={gold.id} className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500">
              {new Date(gold.created_at).toLocaleTimeString('en-US', {
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
            <div className="text-center">
              <p className="text-xs text-emerald-400 mb-1">Buy</p>
              <p className="text-base font-semibold tabular-nums">{formatNumber(gold.buying_price)}</p>
              {index === 0 && <ChangeBadge value={gold.buyChange} />}
            </div>
            <div className="text-center">
              <p className="text-xs text-rose-400 mb-1">Sell</p>
              <p className="text-base font-semibold tabular-nums">{formatNumber(gold.selling_price)}</p>
              {index === 0 && <ChangeBadge value={gold.sellChange} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  </Link>
)

export default function Gold() {
  const [goldData, setGoldData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGoldPrices()
  }, [])

  const fetchGoldPrices = async () => {
    try {
      setLoading(true)

      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const dayBeforeYesterday = new Date(Date.now() - 172800000).toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('gold_prices')
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

      // Group world gold by time
      const worldGoldEntries = displayData.filter(d => d.gold_type === 'world')
      worldGoldEntries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      // Group Myanmar gold by gold_type
      const myanmarGoldGrouped = {}
      displayData.filter(d => d.gold_type !== 'world').forEach(gold => {
        if (!myanmarGoldGrouped[gold.gold_type]) {
          myanmarGoldGrouped[gold.gold_type] = []
        }
        myanmarGoldGrouped[gold.gold_type].push(gold)
      })

      // Sort each group by time and add change calculation
      Object.keys(myanmarGoldGrouped).forEach(type => {
        myanmarGoldGrouped[type].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        
        // Add change to each entry
        const compareItem = isUsingYesterdayData
          ? dayBeforeYesterdayData.find(d => d.gold_type === type)
          : yesterdayData.find(d => d.gold_type === type)
        
        myanmarGoldGrouped[type] = myanmarGoldGrouped[type].map(gold => ({
          ...gold,
          buyChange: compareItem ? gold.buying_price - compareItem.buying_price : 0,
          sellChange: compareItem ? gold.selling_price - compareItem.selling_price : 0,
        }))
      })

      // Calculate world gold change
      const compareWorldGold = isUsingYesterdayData
        ? dayBeforeYesterdayData.find(d => d.gold_type === 'world')
        : yesterdayData.find(d => d.gold_type === 'world')
      
      const worldChange = worldGoldEntries.length > 0 && compareWorldGold
        ? worldGoldEntries[0].price - compareWorldGold.price
        : 0

      setGoldData({
        lastUpdated: displayData[0]?.created_at || new Date().toISOString(),
        world: {
          price: worldGoldEntries[0]?.price || 0,
          change: worldChange,
        },
        myanmar: myanmarGoldGrouped,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const goldTypeNames = {
    '16peye_old': { name: '16 PeYe', subtitle: 'Old System' },
    '15peye_old': { name: '15 PeYe', subtitle: 'Old System' },
    '16peye_new': { name: '16 PeYe', subtitle: 'New System' },
    '15peye_new': { name: '15 PeYe', subtitle: 'New System' },
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin"></div>
        <p className="text-slate-400 text-sm">Loading gold prices...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-rose-400">Error: {error}</p>
        <button onClick={fetchGoldPrices} className="mt-3 text-yellow-400 text-sm hover:underline">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SEO 
        title="Gold Prices Myanmar - Today Rates"
        description="Latest gold prices in Myanmar. World gold, 16 Pae, 15 Pae gold rates updated daily. Track Myanmar gold market prices and changes."
        keywords="gold prices Myanmar, Myanmar gold rates, 16 pae gold, 15 pae gold, world gold price, gold market Myanmar"
        url="/gold"
      />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          <span className="text-gold-gradient">Gold</span> Prices
        </h1>
        <p className="text-sm text-slate-500 mt-1">Live gold rates in Myanmar</p>
      </div>

      {/* World Gold */}
      {goldData?.world?.price > 0 && (
        <WorldGoldCard
          price={goldData.world.price}
          change={goldData.world.change}
          lastUpdated={goldData.lastUpdated}
        />
      )}

      {/* Myanmar Gold */}
      {goldData?.myanmar && Object.keys(goldData.myanmar).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-yellow-500 rounded"></span>
            Myanmar Gold Prices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
            {Object.entries(goldData.myanmar).map(([goldType, goldEntries]) => {
              const meta = goldTypeNames[goldType] || { name: goldType, subtitle: '1 Kyatthar' }
              return (
                <MyanmarGoldCard
                  key={goldType}
                  name={meta.name}
                  subtitle={meta.subtitle}
                  goldData={goldEntries}
                  goldType={goldType}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!goldData?.world?.price && (!goldData?.myanmar || Object.keys(goldData.myanmar).length === 0)) && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-slate-400">No gold prices available</p>
        </div>
      )}
    </div>
  )
}

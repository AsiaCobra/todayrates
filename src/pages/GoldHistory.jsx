import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Format number with 2 decimal places
const formatNumber = (num, decimals = 2) => {
  if (!num) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

// Format date
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// Format time
const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Change badge
const ChangeBadge = ({ value }) => {
  if (!value || value === 0) return null
  const isPositive = value > 0
  return (
    <span className={`inline-flex items-center text-xs font-medium ${
      isPositive ? 'text-emerald-400' : 'text-rose-400'
    }`}>
      {isPositive ? '↑' : '↓'} {formatNumber(Math.abs(value), value < 100 ? 2 : 0)}
    </span>
  )
}

// History row
const HistoryRow = ({ time, price, buyPrice, sellPrice, priceChange, buyChange, sellChange, isWorld }) => (
  <div className="glass-card rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span className="text-sm font-medium">{time}</span>
    </div>
    {isWorld ? (
      <div className="text-right">
        <p className="text-xs text-slate-500">Price</p>
        <p className="font-semibold tabular-nums text-yellow-400">${formatNumber(price, 2)}</p>
        <ChangeBadge value={priceChange} />
      </div>
    ) : (
      <div className="flex gap-6">
        <div className="text-right">
          <p className="text-xs text-slate-500">Buy</p>
          <p className="font-semibold tabular-nums text-emerald-400">{formatNumber(buyPrice)}</p>
          <ChangeBadge value={buyChange} />
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Sell</p>
          <p className="font-semibold tabular-nums text-rose-400">{formatNumber(sellPrice)}</p>
          <ChangeBadge value={sellChange} />
        </div>
      </div>
    )}
  </div>
)

export default function GoldHistory() {
  const { type } = useParams()
  const [history, setHistory] = useState([])
  const [latestPrice, setLatestPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingPage, setLoadingPage] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const PER_PAGE = parseInt(import.meta.env.VITE_HISTORY_PER_PAGE || '50')

  const goldTypeNames = {
    world: { name: 'World Gold', subtitle: 'International Price' },
    '16pae_old': { name: '16 PeYe', subtitle: 'Old System (စနစ်ဟောင်း)' },
    '15pae_old': { name: '15 PeYe', subtitle: 'Old System (စနစ်ဟောင်း)' },
    '16pae_new': { name: '16 PeYe', subtitle: 'New System (စနစ်သစ်)' },
    '15pae_new': { name: '15 PeYe', subtitle: 'New System (စနစ်သစ်)' },
  }

  const meta = goldTypeNames[type] || { name: type, subtitle: 'Gold Price' }
  const isWorld = type === 'world'

  useEffect(() => {
    if (type) {
      setPage(1)
      fetchHistory(1)
    }
  }, [type])

  const fetchHistory = async (pageNum = page) => {
    try {
      // Show different loading state for initial load vs page change
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingPage(true)
      }

      // Get total count
      const { count } = await supabase
        .from('gold_prices')
        .select('*', { count: 'exact', head: true })
        .eq('gold_type', type)

      setTotalCount(count || 0)

      // Get paginated data
      const from = (pageNum - 1) * PER_PAGE
      const to = from + PER_PAGE - 1

      const { data, error } = await supabase
        .from('gold_prices')
        .select('*')
        .eq('gold_type', type)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      setHasMore(count > pageNum * PER_PAGE)

      if (data && data.length > 0) {
        if (pageNum === 1) {
          setLatestPrice(data[0])
        }

        // Calculate changes
        const withChanges = data.map((price, index) => {
          const prevPrice = data[index + 1]
          return {
            ...price,
            priceChange: prevPrice && price.price ? price.price - prevPrice.price : 0,
            buyChange: prevPrice && price.buying_price ? price.buying_price - prevPrice.buying_price : 0,
            sellChange: prevPrice && price.selling_price ? price.selling_price - prevPrice.selling_price : 0,
          }
        })

        // Group by date
        const grouped = withChanges.reduce((acc, price) => {
          const date = price.date
          if (!acc[date]) acc[date] = []
          acc[date].push(price)
          return acc
        }, {})

        setHistory(Object.entries(grouped).map(([date, prices]) => ({ date, prices })))
      } else {
        setHistory([])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingPage(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    fetchHistory(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin"></div>
        <p className="text-slate-400 text-sm">Loading history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-rose-400">Error: {error}</p>
        <button onClick={fetchHistory} className="mt-3 text-yellow-400 text-sm hover:underline">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gold Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{meta.name}</h1>
          <p className="text-sm text-slate-500">{meta.subtitle}</p>
        </div>
      </div>

      {/* Latest Price Card */}
      {latestPrice && (
        <div className="glass-card rounded-2xl p-5 gold-glow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Current Price</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-gold"></span>
              <span className="text-xs text-emerald-400">Live</span>
            </div>
          </div>
          {isWorld ? (
            <div className="text-center p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-400 mb-1">Per Ounce</p>
              <p className="text-2xl font-bold tabular-nums text-gold-gradient">${formatNumber(latestPrice.price, 2)}</p>
              <p className="text-xs text-slate-500 mt-1">USD</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs text-emerald-400 mb-1">Buy Price</p>
                <p className="text-2xl font-bold tabular-nums">{formatNumber(latestPrice.buying_price)}</p>
                <p className="text-xs text-slate-500 mt-1">MMK per Kyatthar</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <p className="text-xs text-rose-400 mb-1">Sell Price</p>
                <p className="text-2xl font-bold tabular-nums">{formatNumber(latestPrice.selling_price)}</p>
                <p className="text-xs text-slate-500 mt-1">MMK per Kyatthar</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-yellow-500 rounded"></span>
          Price History
        </h3>

        {history.length > 0 ? (
          <>
            {/* Loading overlay for pagination */}
            {loadingPage && (
              <div className="glass-card rounded-xl p-8 mb-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin"></div>
                  <p className="text-slate-400 text-sm">Loading page {page}...</p>
                </div>
              </div>
            )}

            <div className={`space-y-6 ${loadingPage ? 'opacity-50 pointer-events-none' : ''}`}>
              {history.map(({ date, prices }) => (
                <div key={date}>
                  <p className="text-sm font-medium text-slate-300 mb-3">{formatDate(date)}</p>
                  <div className="space-y-2">
                    {prices.map((price) => (
                      <HistoryRow
                        key={price.id}
                        time={formatTime(price.created_at)}
                        price={price.price}
                        buyPrice={price.buying_price}
                        sellPrice={price.selling_price}
                        priceChange={price.priceChange}
                        buyChange={price.buyChange}
                        sellChange={price.sellChange}
                        isWorld={isWorld}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalCount > PER_PAGE && (
              <div className="glass-card rounded-xl p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Showing {((page - 1) * PER_PAGE) + 1} - {Math.min(page * PER_PAGE, totalCount)} of {totalCount}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1 || loadingPage}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.ceil(totalCount / PER_PAGE) }, (_, i) => i + 1)
                        .filter(p => {
                          // Show first, last, current, and neighbors
                          const maxPages = Math.ceil(totalCount / PER_PAGE)
                          return p === 1 || p === maxPages || Math.abs(p - page) <= 1
                        })
                        .map((p, i, arr) => (
                          <span key={p}>
                            {i > 0 && arr[i - 1] !== p - 1 && (
                              <span className="text-slate-500">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(p)}
                              disabled={loadingPage}
                              className={`px-3 py-2 rounded-lg transition-colors ${
                                p === page
                                  ? 'bg-yellow-500 text-slate-900 font-semibold'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {p}
                            </button>
                          </span>
                        ))}
                    </div>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!hasMore || loadingPage}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-slate-400">No history available</p>
          </div>
        )}
      </div>
    </div>
  )
}

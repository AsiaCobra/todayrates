import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import RateCard from '../components/RateCard'
import GoldCard from '../components/GoldCard'
// import FooterGuide from '../components/FooterGuide'

export default function Home() {
  const [activeTab, setActiveTab] = useState('gold')
  const [rates, setRates] = useState([])
  const [goldPrices, setGoldPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodayData()
  }, [])

  const fetchTodayData = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]

      const [ratesResult, goldResult] = await Promise.all([
        supabase
          .from('exchange_rates')
          .select('*')
          .eq('date', today)
          .order('currency_from', { ascending: true }),
        supabase
          .from('gold_prices')
          .select('*')
          .eq('date', today)
          .order('gold_type', { ascending: true })
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-600">Error loading rates: {error}</p>
          <button
            onClick={fetchTodayData}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // Separate gold types
  const worldGold = goldPrices.find(g => g.gold_type === 'world')
  const oldSystemGold = goldPrices.filter(g => g.gold_type.includes('_old'))
  const newSystemGold = goldPrices.filter(g => g.gold_type.includes('_new'))

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Today's Rates
        </h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('gold')}
            className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'gold'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-xl mr-2">🪙</span>
            Gold Prices
          </button>
          <button
            onClick={() => setActiveTab('exchange')}
            className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'exchange'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-xl mr-2">💱</span>
            Exchange Rates
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'gold' && (
        <div>
          {goldPrices.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-yellow-700">No gold prices available for today.</p>
                <p className="text-sm text-yellow-600 mt-2">
                  Please check back later or view historical prices.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* World Gold */}
              {worldGold && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                    World Gold / ကမ္ဘာ့ရွှေဈေး
                  </h3>
                  <div className="max-w-md">
                    <GoldCard
                      goldType={worldGold.gold_type}
                      unit={worldGold.unit}
                      price={worldGold.price}
                    />
                  </div>
                </div>
              )}

              {/* Myanmar Gold - Old System */}
              {oldSystemGold.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                    Old System / စနစ်ဟောင်း
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    {oldSystemGold.map((gold) => (
                      <GoldCard
                        key={gold.id}
                        goldType={gold.gold_type}
                        unit={gold.unit}
                        buyingPrice={gold.buying_price}
                        sellingPrice={gold.selling_price}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Myanmar Gold - New System */}
              {newSystemGold.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                    New System / စနစ်သစ်
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    {newSystemGold.map((gold) => (
                      <GoldCard
                        key={gold.id}
                        goldType={gold.gold_type}
                        unit={gold.unit}
                        buyingPrice={gold.buying_price}
                        sellingPrice={gold.selling_price}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'exchange' && (
        <div>
          {rates.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-yellow-700">No exchange rates available for today.</p>
                <p className="text-sm text-yellow-600 mt-2">
                  Please check back later or view historical rates.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rates.map((rate) => (
                <RateCard
                  key={rate.id}
                  currency={rate.currency_from}
                  buyingRate={rate.buying_rate}
                  sellingRate={rate.selling_rate}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Guide Accordion - Hidden for now */}
      {/* <FooterGuide /> */}
    </div>
  )
}

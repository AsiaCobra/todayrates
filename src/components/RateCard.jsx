import { getCurrencyMeta } from '../lib/currencies'

export default function RateCard({ currency, buyingRate, sellingRate }) {
  const meta = getCurrencyMeta(currency)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{meta.flag}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{currency}</h3>
            <p className="text-sm text-gray-500">{meta.name}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-gray-500 uppercase">to MMK</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs font-medium text-green-600 mb-1">Buy</p>
          <p className="text-xl font-bold text-green-700">
            {Number(buyingRate).toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <p className="text-xs font-medium text-red-600 mb-1">Sell</p>
          <p className="text-xl font-bold text-red-700">
            {Number(sellingRate).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function GoldCard({ goldType, unit, price, buyingPrice, sellingPrice }) {
  const isWorldGold = goldType === 'world'

  const goldTypeNames = {
    world: 'World Gold Price',
    '16pae_old': '16 ပဲရည် (စနစ်ဟောင်း)',
    '15pae_old': '15 ပဲရည် (စနစ်ဟောင်း)',
    '16pae_new': '16 ပဲရည် (စနစ်သစ်)',
    '15pae_new': '15 ပဲရည် (စနစ်သစ်)',
  }

  const goldTypeNamesEn = {
    world: 'International Gold',
    '16pae_old': '16 Pae (Old System)',
    '15pae_old': '15 Pae (Old System)',
    '16pae_new': '16 Pae (New System)',
    '15pae_new': '15 Pae (New System)',
  }

  if (isWorldGold) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🌍</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {goldTypeNames[goldType]}
              </h3>
              <p className="text-sm text-gray-500">{goldTypeNamesEn[goldType]}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Unit (oz)</span>
            <span className="text-sm font-medium text-gray-600">Price (USD)</span>
          </div>
          <div className="border-t border-yellow-200 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-800">1</span>
              <span className="text-2xl font-bold text-amber-600">
                {Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Myanmar Gold Card
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-yellow-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🪙</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {goldTypeNames[goldType]}
            </h3>
            <p className="text-sm text-gray-500">{goldTypeNamesEn[goldType]}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-gray-500 uppercase">MMK</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50/80 rounded-lg p-3 border border-green-100">
          <p className="text-xs font-medium text-green-600 mb-1">ဝယ်ဈေး (Buy)</p>
          <p className="text-xl font-bold text-green-700">
            {Number(buyingPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-red-50/80 rounded-lg p-3 border border-red-100">
          <p className="text-xs font-medium text-red-600 mb-1">ရောင်းဈေး (Sell)</p>
          <p className="text-xl font-bold text-red-700">
            {Number(sellingPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  )
}

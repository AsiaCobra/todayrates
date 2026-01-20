export default function GoldTable({ goldPrices, onEdit, onDelete, isAdmin = false }) {
  if (!goldPrices || goldPrices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No gold prices found.
      </div>
    )
  }

  const goldTypeNames = {
    world: 'World Gold',
    '16pae_old': '16 ပဲရည် (ဟောင်း)',
    '15pae_old': '15 ပဲရည် (ဟောင်း)',
    '16pae_new': '16 ပဲရည် (သစ်)',
    '15pae_new': '15 ပဲရည် (သစ်)',
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-amber-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gold Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price / Buying
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Selling
            </th>
            {isAdmin && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {goldPrices.map((gold) => (
            <tr key={gold.id} className="hover:bg-amber-50/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(gold.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {goldTypeNames[gold.gold_type] || gold.gold_type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {gold.gold_type === 'world' ? (
                  <span className="text-amber-600">
                    ${Number(gold.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                ) : (
                  <span className="text-green-600">
                    {Number(gold.buying_price).toLocaleString()} MMK
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {gold.gold_type === 'world' ? (
                  <span className="text-gray-400">-</span>
                ) : (
                  <span className="text-red-600">
                    {Number(gold.selling_price).toLocaleString()} MMK
                  </span>
                )}
              </td>
              {isAdmin && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(gold)}
                    className="text-amber-600 hover:text-amber-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(gold.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

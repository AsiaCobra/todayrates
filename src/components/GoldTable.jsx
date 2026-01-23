export default function GoldTable({ goldPrices, onEdit, onDelete, isAdmin = false }) {
  if (!goldPrices || goldPrices.length === 0) {
    return <div className="text-center py-8 text-slate-500">No gold prices found.</div>
  }

  const goldTypeNames = {
    world: 'World Gold',
    '16peye_old': '16 PeYe (Old)',
    '15peye_old': '15 PeYe (Old)',
    '16peye_new': '16 PeYe (New)',
    '15peye_new': '15 PeYe (New)',
  }

  const formatDateTime = (date, createdAt) => {
    const d = createdAt ? new Date(createdAt) : new Date(date)
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div className="divide-y divide-slate-800">
      {goldPrices.map((gold) => (
        <div key={gold.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold text-xs">
              {gold.gold_type === 'world' ? '🌍' : '🪙'}
            </div>
            <div>
              <p className="font-medium text-sm">{goldTypeNames[gold.gold_type] || gold.gold_type}</p>
              <p className="text-xs text-slate-500">{formatDateTime(gold.date, gold.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              {gold.gold_type === 'world' ? (
                <>
                  <p className="text-sm text-yellow-400 font-semibold">${Number(gold.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-slate-500">per oz</p>
                </>
              ) : (
                <>
                  <p className="text-sm">
                    <span className="text-emerald-400">{Number(gold.buying_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span className="text-rose-400">{Number(gold.selling_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </p>
                  <p className="text-xs text-slate-500">Buy / Sell</p>
                </>
              )}
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <button onClick={() => onEdit(gold)} className="p-2 rounded-lg hover:bg-slate-700 text-yellow-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => onDelete(gold.id)} className="p-2 rounded-lg hover:bg-slate-700 text-rose-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

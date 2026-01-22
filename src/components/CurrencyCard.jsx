import { useState } from 'react'

const CurrencyCard = ({ code, meta, selected, buyingRate, sellingRate, onChange, onToggle }) => {
  return (
    <div className={`glass-card rounded-xl p-4 border transition-all ${
      selected ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-700 bg-slate-800/30'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">
            {meta.flag}
          </div>
          <div>
            <p className="font-semibold text-sm">{code}</p>
            <p className="text-xs text-slate-500">{meta.name}</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onToggle(code, e.target.checked)}
          className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
        />
      </div>
      
      {selected && (
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Buying Rate (MMK)
            </label>
            <input
              type="number"
              step="0.01"
              value={buyingRate}
              onChange={(e) => onChange(code, 'buying', e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-300 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Selling Rate (MMK)
            </label>
            <input
              type="number"
              step="0.01"
              value={sellingRate}
              onChange={(e) => onChange(code, 'selling', e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-300 placeholder-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrencyCard

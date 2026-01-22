import { useState } from 'react'

const GoldTypeCard = ({ goldType, name, unit, selected, price, buyingPrice, sellingPrice, onChange, onToggle }) => {
  const isWorldGold = goldType === 'world'
  
  return (
    <div className={`glass-card rounded-xl p-4 border transition-all ${
      selected ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-slate-700 bg-slate-800/30'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-600/20 flex items-center justify-center">
            {isWorldGold ? (
              <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
            ) : (
              <span className="text-yellow-400 font-bold text-sm">{name.slice(0, 2)}</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-slate-500">{unit}</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onToggle(goldType, e.target.checked)}
          className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer"
        />
      </div>
      
      {selected && (
        <div className="space-y-2">
          {isWorldGold ? (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Price (USD/oz)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => onChange(goldType, 'price', e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-300 placeholder-slate-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Buying Price (MMK)
                </label>
                <input
                  type="number"
                  step="1"
                  value={buyingPrice}
                  onChange={(e) => onChange(goldType, 'buying', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-300 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Selling Price (MMK)
                </label>
                <input
                  type="number"
                  step="1"
                  value={sellingPrice}
                  onChange={(e) => onChange(goldType, 'selling', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-300 placeholder-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-colors"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default GoldTypeCard

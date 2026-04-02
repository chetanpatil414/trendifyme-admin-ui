// src/components/features/Dashboard/StatsOverview.jsx
import React from 'react';

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl">
      <div className="md:col-span-2 p-6 bg-surface-container-lowest rounded-2xl shadow-sm shadow-slate-200/50 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Inventory Value</p>
            <h3 className="text-3xl font-extrabold text-on-surface mt-1">$124,500.00</h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
          <span className="material-symbols-outlined text-xs">trending_up</span>
          +12% FROM LAST MONTH
        </div>
      </div>
      
      <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm shadow-slate-200/50">
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Active Skus</p>
        <h3 className="text-3xl font-extrabold text-on-surface mt-1">1,204</h3>
        <div className="mt-4 w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary w-3/4 h-full"></div>
        </div>
        <p className="text-[10px] text-on-surface-variant mt-2 italic">75% of target capacity</p>
      </div>
      
      <div className="p-6 bg-gradient-to-br from-indigo-600 to-primary rounded-2xl shadow-lg shadow-primary/20 text-on-primary flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Out of Stock Alert</p>
          <h3 className="text-3xl font-extrabold mt-1">18</h3>
        </div>
        <button className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-xs font-bold transition-all">
          Restock Now
        </button>
      </div>
    </div>
  );
}

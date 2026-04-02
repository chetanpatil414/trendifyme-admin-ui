import React from 'react';
import { NavLink } from 'react-router-dom';
import { AlertCircle, PackageX } from 'lucide-react';

export default function ProductsTable({ products = [], pagination, loading, error, onPageChange, onRetry }) {
  const { currentPage = 0, totalPages = 1, totalElements = 0, pageSize = 10 } = pagination || {};
  const startObj = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endObj = Math.min((currentPage + 1) * pageSize, totalElements);

  // Helper to parse arrays that might be stored as JSON strings in the backend
  const parseArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return typeof val === 'string' ? [val] : [];
    }
  };

  if (error) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm shadow-slate-200/50">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Failed to load payload</h3>
        <p className="text-on-surface-variant text-sm max-w-sm mb-6">{error}</p>
        <button onClick={onRetry} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:opacity-95 transition-opacity">
          Retry Connection
        </button>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm shadow-slate-200/50 min-h-[400px]">
        <div className="w-20 h-20 rounded-full bg-surface-container-high/50 flex items-center justify-center text-on-surface-variant mb-5">
          <PackageX size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2 tracking-tight">No products available</h3>
        <p className="text-on-surface-variant text-sm max-w-md mb-8">
          Your inventory looks empty right now. Start by adding your very first product to populate this dashboard and manage your catalog.
        </p>
        <NavLink to="/add-product" className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add New Product
        </NavLink>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm shadow-slate-200/50 w-full overflow-x-auto relative">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-surface-container-low/50 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
            <th className="px-6 py-4 w-12">
              <input className="rounded text-primary focus:ring-primary/20 border-outline-variant/30" type="checkbox" />
            </th>
            <th className="px-6 py-4">Product Details</th>
            <th className="px-6 py-4">Category / Brand</th>
            <th className="px-6 py-4">Pricing</th>
            <th className="px-6 py-4">Stock Status</th>
            <th className="px-6 py-4">Variants</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container relative">
          
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Spinner />
                <p className="text-sm font-semibold text-primary mt-3 animate-pulse">Syncing catalog...</p>
              </div>
            </div>
          )}

          {products.map((product) => {
            const sizesArr = parseArray(product.sizes);
            const colorsArr = parseArray(product.colors);
            
            // Map image natively if it exists, else placeholder
            const coverImage = (product.images && product.images.length > 0) ? product.images[0].url : 'https://placehold.co/400x400/edf4ff/0058cd?text=No+Image';
            
            // Recompute dynamic Stock logic based on values
            const stockCheck = parseInt(product.stock) || 0;
            const threshold = parseInt(product.lowStockAlert) || 10;
            let statusConfig = { label: 'In Stock', styles: 'bg-emerald-100 text-emerald-700' };
            if (stockCheck === 0) statusConfig = { label: 'Out of Stock', styles: 'bg-rose-100 text-rose-700' };
            else if (stockCheck <= threshold) statusConfig = { label: 'Low Stock', styles: 'bg-amber-100 text-amber-700' };

            return (
              <tr key={product.id || Math.random()} className="group hover:bg-surface-container-low/50 transition-colors duration-200 bg-white relative">
                <td className="px-6 py-5">
                  <input className="rounded text-primary focus:ring-primary/20 border-outline-variant/30" type="checkbox" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 shadow-sm border border-outline-variant/10">
                      <img className="w-full h-full object-cover" alt={product.name} src={product.images?.[0] || coverImage} onError={(e) => e.target.src='https://placehold.co/400x400/edf4ff/0058cd?text=No+Image'} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface line-clamp-1" title={product.name}>{product.name}</p>
                      <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5" title={product.shortDesc}>{product.shortDesc}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-on-surface capitalize">{product.category || '—'}</span>
                    <span className="text-[11px] font-medium text-on-surface-variant capitalize mt-0.5">{product.brand || '—'}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm flex flex-col items-start leading-tight">
                    <span className="font-bold text-on-surface">${parseFloat(product.price || 0).toFixed(2)}</span>
                    {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
                      <span className="text-[11px] text-on-surface-variant line-through opacity-70 mt-0.5 font-medium">
                        ${parseFloat(product.comparePrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bolder uppercase tracking-wide inline-flex ${statusConfig.styles}`}>
                    {statusConfig.label} ({stockCheck})
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2 relative">
                    {sizesArr.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {sizesArr.slice(0,3).map((size, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded-md bg-surface-container-high border border-outline-variant/20 text-[10px] text-on-surface-variant font-bold uppercase shadow-sm">
                            {typeof size === 'object' ? size.label : size}
                          </span>
                        ))}
                        {sizesArr.length > 3 && <span className="text-[10px] text-on-surface-variant font-bold ml-1">+{sizesArr.length - 3}</span>}
                      </div>
                    )}
                    {colorsArr.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {colorsArr.slice(0,4).map((c, i) => (
                          <div key={i} className={`w-3 h-3 rounded-full border border-outline-variant/30 shadow-sm`} style={{ backgroundColor: c?.replace('bg-','').replace('-500','') || '#ccc' }}></div>
                        ))}
                      </div>
                    )}
                    {(sizesArr.length === 0 && colorsArr.length === 0) && <span className="text-xs text-on-surface-variant italic">—</span>}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-1">
                    <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Edit">
                      <span className="material-symbols-outlined text-[18px]">edit_square</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all" title="Delete">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Pagination Footer */}
      {!loading && products.length > 0 && (
        <div className="px-6 py-4 flex items-center justify-between text-sm bg-surface-container-lowest border-t border-surface-container">
          <p className="text-on-surface-variant font-medium">
            Showing <span className="font-bold text-on-surface">{startObj}-{endObj}</span> of {totalElements} products
          </p>
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 rounded-md hover:bg-surface-container-low text-on-surface-variant disabled:opacity-30 transition-all border border-transparent hover:border-outline-variant/20 shadow-sm"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                // simple windowing
                if (totalPages > 5 && i !== 0 && i !== totalPages - 1 && Math.abs(i - currentPage) > 1) {
                  if (i === 1 || i === totalPages - 2) return <span key={i} className="px-1 text-on-surface-variant">...</span>;
                  return null;
                }
                
                return (
                  <button 
                    key={i} 
                    onClick={() => onPageChange(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      currentPage === i 
                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                        : 'text-on-surface-variant hover:bg-surface-container-low border border-transparent hover:border-outline-variant/20'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <button 
              disabled={currentPage === totalPages - 1 || totalPages === 0}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1 rounded-md hover:bg-surface-container-low text-on-surface-variant disabled:opacity-30 transition-all border border-transparent hover:border-outline-variant/20 shadow-sm"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple local spinner block for loading states
function Spinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

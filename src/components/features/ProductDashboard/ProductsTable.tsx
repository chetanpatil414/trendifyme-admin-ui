// src/components/features/ProductDashboard/ProductsTable.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { AlertCircle, PackageX } from 'lucide-react';
import { Product } from '../../../types/product';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

interface ProductsTableProps {
  products: Product[];
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export default function ProductsTable({ products = [], pagination, loading, error, onPageChange, onRetry }: ProductsTableProps) {
  const { currentPage = 0, totalPages = 1, totalElements = 0, pageSize = 10 } = pagination || {};
  const startObj = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endObj = Math.min((currentPage + 1) * pageSize, totalElements);

  const parseArray = (val: any): any[] => {
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
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-[rgba(160,180,203,0.1)]">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-[#213447] mb-2">Failed to load catalog</h3>
        <p className="text-[#697d92] text-sm max-w-sm mb-6">{error}</p>
        <button onClick={onRetry} className="px-6 py-2.5 bg-[#0058cd] text-white font-semibold rounded-lg shadow-md hover:opacity-95 transition-all">
          Retry Connection
        </button>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm border border-[rgba(160,180,203,0.1)] min-h-[400px]">
        <div className="w-20 h-20 rounded-full bg-[#f8fbff] flex items-center justify-center text-[#697d92] mb-5">
          <PackageX size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-[#213447] mb-2 tracking-tight">No products available</h3>
        <p className="text-[#697d92] text-sm max-w-md mb-8">
          Your inventory looks empty right now. Start by adding your first product to populate this dashboard.
        </p>
        <NavLink to="/add-product" className="px-6 py-3 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-[#0058cd]/20 flex items-center gap-2 hover:scale-[1.02] transition-all">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add New Product
        </NavLink>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[rgba(160,180,203,0.1)] w-full overflow-x-auto relative min-h-[400px]">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-[#f8fbff] text-[#697d92] text-[11px] font-bold uppercase tracking-wider">
            <th className="px-6 py-4 w-12">
              <input className="rounded text-[#0058cd] focus:ring-[#0058cd]/20 border-[rgba(160,180,203,0.3)]" type="checkbox" />
            </th>
            <th className="px-6 py-4">Product Details</th>
            <th className="px-6 py-4">Category / Brand</th>
            <th className="px-6 py-4">Pricing</th>
            <th className="px-6 py-4">Stock Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(160,180,203,0.1)] relative">
          
          {loading && (
            <tr className="h-64">
              <td colSpan={6} className="text-center">
                <div className="flex flex-col items-center">
                  <Spinner />
                  <p className="text-sm font-semibold text-[#0058cd] mt-3 animate-pulse uppercase tracking-widest">Syncing catalog...</p>
                </div>
              </td>
            </tr>
          )}

          {!loading && products.map((product) => {
            const coverImage = (product.media && product.media.length > 0) ? product.media[0].url : 'https://placehold.co/400x400/edf4ff/0058cd?text=No+Image';
            
            // Simplified status logic for migration
            const statusConfig = { label: 'In Stock', styles: 'bg-emerald-50 text-emerald-700' };

            return (
              <tr key={product.id || Math.random()} className="group hover:bg-[#f8fbff] transition-colors duration-200 bg-white">
                <td className="px-6 py-5">
                  <input className="rounded text-[#0058cd] focus:ring-[#0058cd]/20 border-[rgba(160,180,203,0.3)]" type="checkbox" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f8fbff] flex-shrink-0 shadow-sm border border-[rgba(160,180,203,0.1)] text-[#0058cd] flex items-center justify-center">
                       <img className="w-full h-full object-cover" alt={product.name} src={coverImage} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#213447] line-clamp-1" title={product.name}>{product.name}</p>
                      <p className="text-xs text-[#697d92] line-clamp-1 mt-0.5" title={product.description}>{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#213447] capitalize">ID: {product.categoryId || '—'}</span>
                    <span className="text-[11px] font-medium text-[#697d92] capitalize mt-0.5">TrendifyMe</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm flex flex-col items-start leading-tight">
                    <span className="font-bold text-[#213447]">$0.00</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide inline-flex ${statusConfig.styles}`}>
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="w-8 h-8 flex items-center justify-center text-[#697d92] hover:text-[#0058cd] hover:bg-[#edf4ff] rounded-lg transition-all">
                      <span className="material-symbols-outlined text-[18px]">edit_square</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-[#697d92] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {!loading && products.length > 0 && (
        <div className="px-6 py-4 flex items-center justify-between text-sm bg-white border-t border-[rgba(160,180,203,0.1)]">
          <p className="text-[#697d92] font-medium">
            Showing <span className="font-bold text-[#213447]">{startObj}-{endObj}</span> of {totalElements} products
          </p>
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 rounded-md hover:bg-[#f8fbff] text-[#697d92] disabled:opacity-30 transition-all border border-transparent shadow-sm"
              aria-label="Previous Page"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => onPageChange(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    currentPage === i 
                      ? 'bg-[#0058cd] text-white shadow-md shadow-[#0058cd]/20' 
                      : 'text-[#697d92] hover:bg-[#f8fbff] border border-transparent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages - 1 || totalPages === 0}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1 rounded-md hover:bg-[#f8fbff] text-[#697d92] disabled:opacity-30 transition-all border border-transparent shadow-sm"
              aria-label="Next Page"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-[#0058cd]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

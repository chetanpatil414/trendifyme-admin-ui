// src/components/features/ProductDashboard/ProductsDashboardView.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import StatsOverview from './StatsOverview';
import FiltersBar from './FiltersBar';
import ProductsTable from './ProductsTable';
import { useProducts } from '../../../hooks/useProducts';
import { Plus } from 'lucide-react';

export default function ProductsDashboardView() {
  const { products, pagination, loading, error, actions } = useProducts(0, 10, ['id,DESC']);

  return (
    <div className="p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto animate-fade-slide-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#213447] tracking-tight">Product Management</h1>
          <p className="text-[#697d92] mt-1 font-medium">Manage your clothing inventory and stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-[rgba(160,180,203,0.3)] text-[#697d92] font-semibold rounded-lg text-sm hover:bg-[#f8fbff] transition-all">
            Bulk Actions
          </button>
          <NavLink to="/add-product" className="px-6 py-2.5 primary-gradient text-white font-bold rounded-lg text-sm shadow-md shadow-[#0058cd]/20 flex items-center gap-2 hover:opacity-95 transition-all">
            <Plus size={18} />
            Add Product
          </NavLink>
        </div>
      </div>

      {/* Bento Stats Overview */}
      <StatsOverview />

      {/* Filters & Tabs */}
      <FiltersBar onSortChange={actions.setSort} />

      {/* Table Section */}
      <ProductsTable 
        products={products} 
        pagination={pagination} 
        loading={loading} 
        error={error} 
        onPageChange={actions.setPage} 
        onRetry={actions.refetch}
      />
      
      <div className="h-8"></div>
    </div>
  );
}

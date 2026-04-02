import React from 'react';
import { NavLink } from 'react-router-dom';
import StatsOverview from './StatsOverview';
import FiltersBar from './FiltersBar';
import ProductsTable from './ProductsTable';
import { useProducts } from '../../../hooks/useProducts';

export default function ProductsDashboardView() {
  // Use custom hook with default parameters
  const { products, pagination, loading, error, actions } = useProducts(0, 10, ['id,DESC']);

  return (
    <div className="p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto animate-fade-slide-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Product Management</h1>
          <p className="text-on-surface-variant mt-1">Manage your clothing inventory and stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-surface-container-high text-primary font-semibold rounded-lg text-sm hover:brightness-95 transition-all">
            Bulk Delete
          </button>
          <NavLink to="/add-product" className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg text-sm shadow-md shadow-primary/20 flex items-center gap-2 hover:opacity-95 transition-all">
            <span className="material-symbols-outlined text-lg">add</span>
            Add Product
          </NavLink>
        </div>
      </div>

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

      {/* Bento Stats Overview */}
      <StatsOverview />
      
      {/* Spacer for bottom */}
      <div className="h-8"></div>
    </div>
  );
}

// src/pages/ProductsPage.jsx
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import EmptyStateView from '../components/features/ProductDashboard/EmptyStateView';
import ProductsDashboardView from '../components/features/ProductDashboard/ProductsDashboardView';
import Toast from '../components/ui/Toast';

export default function ProductsPage() {
  // Toggle this state to switch between empty and populated dashboard
  const [hasProducts, setHasProducts] = useState(true);

  return (
    <Layout breadcrumbs={['Products', 'Inventory']}>
      {/* Demo Developer Toggle Overlay */}
      <div className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-slate-200 flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-600">Dev View Toggle:</span>
        <button 
          onClick={() => setHasProducts(!hasProducts)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            hasProducts ? 'bg-primary text-white' : 'bg-surface-container-high text-primary'
          }`}
        >
          {hasProducts ? 'Show Empty State' : 'Show Populated Data'}
        </button>
      </div>

      {hasProducts ? (
        <ProductsDashboardView />
      ) : (
        <>
          <EmptyStateView />
          <Toast 
            title="Did you know?" 
            message="You can sync products directly from Shopify or Amazon." 
          />
        </>
      )}
    </Layout>
  );
}

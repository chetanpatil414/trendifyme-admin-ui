// src/pages/ProductsPage.tsx
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import EmptyStateView from '../components/features/ProductDashboard/EmptyStateView';
import ProductsDashboardView from '../components/features/ProductDashboard/ProductsDashboardView';
import Toast from '../components/ui/Toast';

export default function ProductsPage() {
  const [hasProducts, setHasProducts] = useState(true);

  return (
    <Layout breadcrumbs={['Products', 'Inventory']}>
      {/* Dev Toggle */}
      <div className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-[rgba(160,180,203,0.15)] flex items-center gap-3">
        <span className="text-xs font-semibold text-[#697d92]">Dev Toggle:</span>
        <button 
          onClick={() => setHasProducts(!hasProducts)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            hasProducts ? 'bg-[#0058cd] text-white' : 'bg-[#f8fbff] text-[#0058cd]'
          }`}
        >
          {hasProducts ? 'Empty State' : 'Data View'}
        </button>
      </div>

      {hasProducts ? (
        <ProductsDashboardView />
      ) : (
        <>
          <EmptyStateView />
          <div className="fixed bottom-20 right-8 z-50">
            <Toast 
              message="You can sync products directly from Shopify or Amazon." 
              type="info"
            />
          </div>
        </>
      )}
    </Layout>
  );
}

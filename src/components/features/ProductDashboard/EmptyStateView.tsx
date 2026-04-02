// src/components/features/ProductDashboard/EmptyStateView.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function EmptyStateView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-6xl mx-auto w-full relative">
      {/* Asymmetric Decorative Elements */}
      <div className="absolute top-32 right-12 w-64 h-64 bg-[#0058cd]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-12 left-12 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Empty State Container */}
      <div className="relative z-10 text-center max-w-lg">
        {/* Premium Centered Illustration using Glassmorphism cards */}
        <div className="relative mb-12 flex justify-center">
          <div className="w-64 h-64 relative">
            {/* Background Shape */}
            <div className="absolute inset-0 bg-[#f8fbff] rounded-full opacity-40 scale-110 border border-[#0058cd]/10"></div>
            
            {/* Floating Elements mimicking product cards */}
            <div className="absolute -top-4 -left-8 w-32 h-40 bg-white/60 backdrop-blur-md rounded-xl shadow-lg transform -rotate-12 flex items-center justify-center border border-white/40">
              <span className="material-symbols-outlined text-[#697d92]/30 text-5xl">inventory_2</span>
            </div>
            
            <div className="absolute top-12 -right-4 w-28 h-28 bg-white rounded-xl shadow-xl transform rotate-6 flex items-center justify-center border border-white">
              <span className="material-symbols-outlined text-[#697d92]/20 text-4xl">package_2</span>
            </div>
            
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-32 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col p-4 border border-white/60 overflow-hidden">
              <div className="w-full h-3 bg-[#f1f5f9] rounded-full mb-3"></div>
              <div className="w-3/4 h-3 bg-[#f8fbff] rounded-full mb-3"></div>
              <div className="w-1/2 h-3 bg-[#f8fbff] rounded-full px-2"></div>
              
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center border border-red-100">
                <span className="material-symbols-outlined text-sm">close</span>
              </div>
            </div>
            
            {/* Central Focus Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#0058cd] shadow-xl border border-[rgba(0,88,205,0.05)]">
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'wght' 200" }}>search_off</span>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <h2 className="text-3xl font-bold text-[#213447] tracking-tight mb-4">No products found</h2>
        <p className="text-[#697d92] text-lg leading-relaxed mb-10 font-light">
          Your inventory looks a bit quiet. Start by adding your first product to manage orders, track stock levels, and grow your sales.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NavLink to="/add-product" className="px-8 py-4 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-[#0058cd]/20 hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-3">
            <span className="material-symbols-outlined">add_circle</span>
            <span>Add New Product</span>
          </NavLink>
          <button className="px-8 py-4 bg-white text-[#0058cd] font-semibold rounded-xl border border-[rgba(0,88,205,0.2)] hover:bg-[#f8fbff] transition-all flex items-center gap-3">
            <span className="material-symbols-outlined">upload_file</span>
            <span>Import CSV</span>
          </button>
        </div>

        {/* Secondary Guidance */}
        <p className="mt-12 text-[#697d92] text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
          Need help getting started?{' '}
          <a className="text-[#0058cd] font-semibold hover:underline decoration-2 underline-offset-4" href="#">
            Read our guide
          </a>
        </p>
      </div>
    </div>
  );
}

// src/components/features/ProductDashboard/FiltersBar.tsx
import React from 'react';

interface FiltersBarProps {
  onSortChange?: (sort: string[]) => void;
}

export default function FiltersBar({ onSortChange }: FiltersBarProps) {
  return (
    <div className="bg-white rounded-xl p-2 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm border border-[rgba(160,180,203,0.1)] w-full">
      <div className="flex p-1 bg-[#f8fbff] rounded-lg w-full md:w-auto overflow-x-auto">
        <button className="px-6 py-2 rounded-md text-sm font-semibold bg-white text-[#0058cd] shadow-sm whitespace-nowrap">All Products</button>
        <button className="px-6 py-2 rounded-md text-sm font-medium text-[#697d92] hover:text-[#213447] transition-colors whitespace-nowrap">T-shirt</button>
        <button className="px-6 py-2 rounded-md text-sm font-medium text-[#697d92] hover:text-[#213447] transition-colors whitespace-nowrap">Shirts</button>
        <button className="px-6 py-2 rounded-md text-sm font-medium text-[#697d92] hover:text-[#213447] transition-colors whitespace-nowrap">Bottoms</button>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto px-2">
        <div className="relative flex-1 md:w-48">
          <select className="w-full pl-3 pr-10 py-2 bg-transparent border border-[rgba(160,180,203,0.2)] rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#0058cd]/10 focus:border-[#0058cd] transition-all text-[#213447]">
            <option>Stock Status: All</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
            <option>Low Stock</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#697d92]">expand_more</span>
        </div>
        
        <div className="relative flex-1 md:w-48">
          <select 
            onChange={(e) => onSortChange?.([e.target.value])}
            className="w-full pl-3 pr-10 py-2 bg-transparent border border-[rgba(160,180,203,0.2)] rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#0058cd]/10 focus:border-[#0058cd] transition-all font-medium text-[#213447]"
          >
            <option value="id,DESC">Sort: Newest</option>
            <option value="price,ASC">Price: Low to High</option>
            <option value="name,ASC">Name: A to Z</option>
            <option value="name,DESC">Name: Z to A</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#697d92] text-[20px]">sort</span>
        </div>
      </div>
    </div>
  );
}

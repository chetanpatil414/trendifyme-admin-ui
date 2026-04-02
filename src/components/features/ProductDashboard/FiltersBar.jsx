// src/components/features/Dashboard/FiltersBar.jsx
import React from 'react';

export default function FiltersBar() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-2 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm shadow-slate-200/50 w-full">
      <div className="flex p-1 bg-surface-container-low rounded-lg w-full md:w-auto overflow-x-auto">
        <button className="px-6 py-2 rounded-md text-sm font-semibold bg-white text-primary shadow-sm whitespace-nowrap">All Products</button>
        <button className="px-6 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap">T-shirt</button>
        <button className="px-6 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap">Shirts</button>
        <button className="px-6 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap">Bottoms</button>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto px-2">
        <div className="relative flex-1 md:w-48">
          <select className="w-full pl-3 pr-10 py-2 bg-transparent border border-outline-variant/20 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
            <option>Stock Status: All</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
            <option>Low Stock</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
        </div>
        
        <div className="relative flex-1 md:w-48">
          <select 
            onChange={(e) => onSortChange([e.target.value])}
            className="w-full pl-3 pr-10 py-2 bg-transparent border border-outline-variant/20 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-on-surface"
          >
            <option value="id,DESC">Sort: Newest</option>
            <option value="price,ASC">Price: Low to High</option>
            <option value="price,DESC">Price: High to Low</option>
            <option value="name,ASC">Name: A to Z</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">sort</span>
        </div>
      </div>
    </div>
  );
}

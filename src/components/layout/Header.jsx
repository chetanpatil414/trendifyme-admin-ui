// src/components/layout/Header.jsx
import React from 'react';
import { Search, Bell, Plus, ChevronRight } from 'lucide-react';

export default function Header({ breadcrumbs = [], actions }) {
  return (
    <header className="glass sticky top-0 z-20 border-b border-[rgba(160,180,203,0.12)] px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Breadcrumbs */}
      <nav className="flex items-center gap-1.5 min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight size={12} className="text-[#a0b4cb] flex-shrink-0" />}
            <span
              className={`text-sm leading-none ${
                i === breadcrumbs.length - 1
                  ? 'text-[#213447] font-semibold'
                  : 'text-[#4e6175] hover:text-[#0058cd] cursor-pointer transition-colors'
              }`}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-[#edf4ff] rounded-xl px-3 py-2 w-52 border border-transparent hover:border-[rgba(0,88,205,0.2)] transition-all">
          <Search size={14} className="text-[#697d92] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-[#213447] placeholder:text-[#a0b4cb] w-full"
          />
          <kbd className="hidden lg:flex h-5 items-center gap-1 rounded-md bg-white px-1.5 text-[10px] text-[#697d92] border border-[rgba(160,180,203,0.3)]">
            ⌘K
          </kbd>
        </div>

        {/* Notification */}
        <button className="relative w-9 h-9 rounded-xl bg-[#edf4ff] flex items-center justify-center text-[#697d92] hover:text-[#0058cd] hover:bg-[#d9eaff] transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0058cd] rounded-full" />
        </button>

        {/* CTA if any */}
        {actions}
      </div>
    </header>
  );
}

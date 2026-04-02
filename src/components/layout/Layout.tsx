// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: string[];
  headerActions?: React.ReactNode;
  activeNav?: string;
}

export default function Layout({ children, breadcrumbs = [], headerActions }: LayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f7f9ff] overflow-hidden text-[#213447] font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, shown on desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-40 lg:relative lg:z-auto lg:flex flex-shrink-0
        transition-transform duration-300 ease-out shadow-xl lg:shadow-none
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#f7f9ff]">
        {/* Mobile Top Bar */}
        <div className="flex lg:hidden items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-md border-b border-[rgba(160,180,203,0.15)] z-20 sticky top-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="w-9 h-9 rounded-xl bg-[#edf4ff] flex items-center justify-center text-[#697d92]"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-semibold text-[#213447]">Precision Admin</span>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block sticky top-0 z-20">
          <Header breadcrumbs={breadcrumbs} actions={headerActions} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

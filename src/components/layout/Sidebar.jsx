// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Store, Sparkles } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/' },
  { id: 'products', label: 'Products', icon: 'inventory_2', path: '/products', badge: '142' },
  { id: 'orders', label: 'Orders', icon: 'shopping_cart', path: '/orders', badge: '8', badgeVariant: 'primary' },
  { id: 'customers', label: 'Customers', icon: 'group', path: '/customers' },
  { id: 'analytics', label: 'Analytics', icon: 'insert_chart', path: '/analytics' },
];

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
];

export default function Sidebar({ onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  const activeClass = "nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative bg-blue-50/50 dark:bg-blue-900/20 text-[#0058cd] dark:text-blue-400 font-semibold";
  const inactiveClass = "nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative text-[#4e6175] hover:bg-[#edf4ff] hover:text-[#213447]";

  const SidebarLink = ({ id, label, icon, path, badge, badgeVariant, end }) => {
    return (
      <NavLink
        to={path}
        end={end}
        onClick={() => onNavigate?.(id)}
        className={({ isActive }) => isActive ? activeClass : inactiveClass}
        title={collapsed ? label : undefined}
      >
        {({ isActive }) => (
          <>
            <span 
              className={`material-symbols-outlined text-[20px] rounded-lg transition-all ${isActive ? 'text-[#0058cd]' : 'text-[#697d92] group-hover:text-[#213447]'}`}
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {icon}
            </span>
            
            {!collapsed && (
              <>
                <span className="text-sm flex-1 leading-none">{label}</span>
                {badge && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                    badgeVariant === 'primary'
                      ? 'bg-[#0058cd] text-white'
                      : 'bg-surface-container text-[#4e6175]'
                    }`}>
                    {badge}
                  </span>
                )}
              </>
            )}
            {isActive && !collapsed && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#0058cd] rounded-l-full" />
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={`relative flex flex-col bg-surface-container-lowest border-r border-[rgba(160,180,203,0.15)] transition-all duration-300 ease-out flex-shrink-0 min-h-screen ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-6 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl primary-gradient flex items-center justify-center flex-shrink-0 shadow-sm">
          <Store size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-[16px] font-extrabold text-[#213447] leading-none tracking-tight">Precision</p>
            <p className="text-xs text-on-surface-variant font-medium leading-none mt-1">Admin</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 z-10 w-6 h-6 rounded-full bg-white border border-[rgba(160,180,203,0.3)] shadow-sm flex items-center justify-center text-[#697d92] hover:text-[#0058cd] hover:border-[#0058cd] transition-all duration-200"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* User Profile */}
      {!collapsed && (
        <div className="mx-4 mb-6 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full primary-gradient flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm overflow-hidden">
             <img 
               alt="User Avatar" 
               className="w-full h-full object-cover" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEuk1k4e2VnjvWNbe2NB3Gg5sIxWnBsSt8eg-COO1D613oGRhlb8O4EcRYzXJFA_7SKBhNhFB8simuRlVeyBsSBcSxZOj9ZXQi7tbQbaSIKiQg_MJdZ3lmfd-icBWtPUC_cEu_ETaRO_o1EEbg1MnYTGT2lfype_Z9h7kuH5C-PAXRRTwqj2SkAMhyof1f1F3Rd5u-Po2RlujAvvURr5vAGxw7HRuqOLHRG8BURUaX1ZCx0ZWhnBpy59mCTKhonElU9D3HhlGk4L0"
               onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='block'; }}
             />
             <span className="hidden text-xs font-bold text-white uppercase tracking-wider">AP</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#213447] truncate tracking-tight">Chetan Patil</p>
            <p className="text-xs text-on-surface-variant truncate font-medium">E-commerce Lead</p>
          </div>
          <Sparkles size={14} className="text-[#0058cd] flex-shrink-0 ml-auto mr-1" />
        </div>
      )}

      {/* Nav Section Label */}
      {!collapsed && (
        <p className="px-5 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mb-2 mt-2">
          Menu
        </p>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(item => <SidebarLink key={item.id} {...item} end={item.path === '/'} />)}
      </nav>

      {/* CTA Button */}
      {!collapsed ? (
        <div className="px-5 mt-auto mb-4">
          <NavLink to="/add-product" className="w-full primary-gradient text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Product</span>
          </NavLink>
        </div>
      ) : (
        <div className="px-3 mt-auto mb-6 flex justify-center">
          <NavLink to="/add-product" className="w-10 h-10 primary-gradient rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center text-white hover:opacity-95 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">add</span>
          </NavLink>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="px-3 py-4 border-t border-[rgba(160,180,203,0.15)] flex flex-col gap-1">
        {bottomItems.map(item => <SidebarLink key={item.id} {...item} />)}
      </div>
    </aside>
  );
}

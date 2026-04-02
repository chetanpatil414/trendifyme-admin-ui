// src/constants/theme.js
export const colors = {
  primary: '#0058cd',
  primaryContainer: '#4784fd',
  primaryDim: '#004db5',
  onPrimary: '#f9f8ff',
  surface: '#f7f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#edf4ff',
  surfaceContainer: '#e3efff',
  surfaceContainerHigh: '#d9eaff',
  surfaceContainerHighest: '#d0e5fd',
  onSurface: '#213447',
  onSurfaceVariant: '#4e6175',
  outline: '#697d92',
  outlineVariant: '#a0b4cb',
  error: '#a83836',
};

export const nav = [
  { id: 'dashboard', label: 'Dashboard',  icon: 'LayoutDashboard', path: '/' },
  { id: 'products',  label: 'Products',   icon: 'Package',          path: '/products', active: true },
  { id: 'orders',    label: 'Orders',     icon: 'ShoppingCart',     path: '/orders' },
  { id: 'customers', label: 'Customers',  icon: 'Users',            path: '/customers' },
  { id: 'analytics', label: 'Analytics',  icon: 'BarChart2',        path: '/analytics' },
  { id: 'settings',  label: 'Settings',   icon: 'Settings',         path: '/settings' },
];

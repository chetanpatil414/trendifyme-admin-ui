// src/pages/DashboardPage.tsx
import React from 'react';
import Layout from '../components/layout/Layout';

export default function DashboardPage() {
  return (
    <Layout breadcrumbs={['Dashboard']}>
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center h-[70vh] text-center animate-fade-slide-up">
        <div className="w-24 h-24 bg-[#0058cd]/10 rounded-full flex items-center justify-center mb-6 text-[#0058cd]">
          <span className="material-symbols-outlined text-5xl">dashboard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#213447] mb-3 tracking-tight">Main Dashboard Overview</h1>
        <p className="text-[#697d92] max-w-md text-lg font-light">
          Please click on the <strong className="text-[#0058cd]">Products</strong> tab in the sidebar to view the Product Management layouts we just built!
        </p>
      </div>
    </Layout>
  );
}

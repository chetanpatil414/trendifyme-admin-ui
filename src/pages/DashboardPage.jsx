// src/pages/DashboardPage.jsx
import React from 'react';
import Layout from '../components/layout/Layout';

export default function DashboardPage() {
  return (
    <Layout breadcrumbs={['Dashboard']}>
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center h-[70vh] text-center animate-fade-slide-up">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
          <span className="material-symbols-outlined text-5xl">dashboard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface mb-3 tracking-tight">Main Dashboard Overview</h1>
        <p className="text-on-surface-variant max-w-md text-lg">
          Please click on the <strong>Products</strong> tab in the sidebar to view the Product Management layouts we just built!
        </p>
      </div>
    </Layout>
  );
}

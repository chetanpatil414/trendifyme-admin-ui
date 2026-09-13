// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddProductPage from './pages/AddProductPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';

import { ManageAttributesPage } from './pages/ManageAttributesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/attributes" element={<ManageAttributesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StockProvider } from './context/StockContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import RestockPage from './pages/RestockPage';

function App() {
  return (
    <StockProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/restock" element={<RestockPage />} />
          </Routes>
        </div>
      </Router>
    </StockProvider>
  );
}

export default App;
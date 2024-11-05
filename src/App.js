import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import ProfilePage from './pages/ProfilePage'; 
import ProductPage from './pages/ProductPage';
import Basic from './pages/cart';

const isAuthenticated = () => {
  return localStorage.getItem('authToken');
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route 
          path="/profile" 
          element={isAuthenticated() ? <ProfilePage /> : <Navigate to="/login" />} 
        />

        <Route path="/product" element={<ProductPage/>} />
        <Route path="/product/:product_id" element={<ProductPage />} />
        <Route path="/cart" element={<Basic />} /> 
      </Routes>
    </Router>
  );
};

export default App;

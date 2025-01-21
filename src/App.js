import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import Login from './pages/LoginPage';
import { ProductsProvider } from './context/ProductsContext'; // Ensure you import ProductsProvider
import RegistrationPage from './pages/RegistrationPage';
import OrderProcessPage from './pages/OrderProcessPage';
import EmailVerification from './pages/EmailVerification';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';

const isAuthenticated = () => {
  return localStorage.getItem('authToken');
};

 
const App = () => {
  return (
    <Router>
      <ProductsProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/profile" 
            element={isAuthenticated() ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:product_id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationPage/>} />
          <Route path="/order" element={<OrderProcessPage/>} />
          <Route path="dj-rest-auth/registration/account-confirm-email/:key/" Component={EmailVerification}></Route>
          {/* <Route path="reset/password/confirm/:uid/:token" Component={ResetPasswordConfirm}></Route> */}
          <Route path="change/password/" Component={ChangePassword}></Route>
          <Route path="reset/password/" Component={ResetPassword}></Route>
            
        </Routes>
      </ProductsProvider>
    </Router>
  );
};

export default App;

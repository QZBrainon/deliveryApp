import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Provider from './context/Provider';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Orders from './pages/Orders';
import OrdersDetail from './pages/OrdersDetail';
import Manage from './pages/Manage';
import Checkout from './pages/Checkout';
import SellerOrders from './pages/SellerOrders';
import './App.css';

function App() {
  return (
    <Provider>
      <Routes>
        <Route exact path="/" element={ <Navigate to="/login" /> } />
        <Route exact path="/login" element={ <Login /> } />
        <Route exact path="/register" element={ <Register /> } />
        <Route exact path="/customer/products" element={ <Products /> } />
        <Route exact path="/customer/orders" element={ <Orders /> } />
        <Route exact path="/customer/orders/:id" element={ <OrdersDetail /> } />
        <Route exact path="/customer/checkout" element={ <Checkout /> } />
        <Route exact path="/admin/manage" element={ <Manage /> } />
        <Route exact path="/seller/orders" element={ <SellerOrders /> } />
      </Routes>
    </Provider>
  );
}

export default App;

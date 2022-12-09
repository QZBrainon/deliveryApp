import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Provider from './context/Provider';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import Products from './pages/Products';
import Pedidos from './pages/Pedidos';

function App() {
  return (
    <Provider>
      <Routes>
        <Route exact path="/" element={ <Navigate to="/login" /> } />
        <Route exact path="/login" element={ <Login /> } />
        <Route exact path="/register" element={ <Register /> } />
        <Route exact path="/customer/products" element={ <Products /> } />
        <Route exact path="/customer/orders" element={ <Pedidos /> } />
      </Routes>
    </Provider>
  );
}

export default App;

import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import Shop from './Shop';
import WishList from './Wishlist';
import ProductInfoPage from './ProductInfoPage';
import CartList from './Cart';
import SignIn from './SigninPage';
import SignUp from './SignUpPage';
import AddressPage from "./AddressPage";
import Checkout from "./Checkout";
import Orders from "./Orders";
import OrderItem from "./OrderItem";
function App() {
  
  return (
      <Routes>
  <Route path="/" element={<HomePage />} />

  {/* All products */}
  <Route path="/products" element={<Shop />} />

  {/* Category filtered */}
  <Route path="/products/category/:category" element={<Shop />} />

  <Route path="/wishlist" element={<WishList />} />
  <Route path="/product/:id" element={<ProductInfoPage />} />
  <Route path="/cartlist" element={<CartList />} />
  <Route path="/signin" element={<SignIn />} />
  <Route path="/signup" element={<SignUp />} />
  <Route path="/address" element={<AddressPage />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<Orders />} />
  <Route
  path="/orders/:orderId" element={<OrderItem />}
/>
</Routes>
  );
}

export default App

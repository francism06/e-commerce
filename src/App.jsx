import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Routes
import NavBar from './components/NavBar';
import AdminNavBar from "./components/AdminNavBar";

// Admin Components
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCreateProduct from "./pages/admin/CreateProduct";
import AdminEditProduct from "./pages/admin/EditProduct";
import AdminServices from "./pages/admin/Services";
import AdminTransactions from "./pages/admin/Transactions";

// User Components
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import Services from "./pages/user/Services";
import AboutUs from "./pages/user/AboutUs";
import ContactUs from "./pages/user/ContactUs";

import Profile from "./pages/user/Profile";
import Cart from "./pages/user/Cart";
import Tracking from "./pages/user/Tracking";
import ManageUsers from "./pages/admin/ManageUsers";

import Login from "./pages/user/Login";
import Register from "./pages/user/Register";

const App = () => {
  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem('user'));

  //   if (user !== null && Object.keys(user).length !== 0) {
  //     console.log(user);
  //   }

  // }, []);

  return (
    <Routes>

      {/* USER NAV */}
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="products" element={<Products />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path="cart" element={<Cart />} />
        <Route path="tracking" element={<Tracking />} />
      </Route>

      {/* ADMIN NAV */}
      <Route path="admin" element={<AdminNavBar />} >
        <Route index element={<AdminDashboard />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/create" element={<AdminCreateProduct />} />
        <Route path="products/edit/:id" element={<AdminEditProduct />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="manage-users" element={<ManageUsers />} />
      </Route>

      <Route path="*" element={<div>Page not Found!</div>} />

      {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
      {/* <Route path="*" element={<NoMatch />} /> */}
    </Routes>


  );
};

export default App;

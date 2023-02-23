import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Routes
import NavBar from './components/NavBar';
import AdminNavBar from "./components/AdminNavBar";

// Admin Components
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products"
import Services from "./pages/admin/Services"
import Transactions from "./pages/admin/Transactions"

// User Components
import Home from "./pages/user/Home";



const App = () => {

  // useEffect(() => {
  //   sessionStorage.setItem('email', null)
  // }, [])

  return (
    <Routes>

      {/* USER NAV */}
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        {/* <Route path="services" element={ } />
        <Route path="products" element={ } />
        <Route path="about-us" element={ } />
        <Route path="contact-us" element={ } />
        <Route path="login" element={ } />
        <Route path="register" element={ } />
        <Route path="cart" element={ } />
        <Route path="tracking" element={ } /> */}
      </Route>

      {/* ADMIN NAV */}
      <Route path="admin" element={<AdminNavBar />} >
        <Route index element={<Dashboard />} />
        <Route path="services" element={<Products />} />
        <Route path="products" element={<Services />} />
        <Route path="transactions" element={<Transactions />} />
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

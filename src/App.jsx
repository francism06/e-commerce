import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/user/Home";
import NavBar from './components/NavBar';
import AdminNavBar from "./components/AdminNavBar";


const App = () => {

  useEffect(() => {
    sessionStorage.setItem('email', null)
  }, [])

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
        {/* <Route index element={} />
        <Route path="events" element={} />
        <Route path="services" element={} />
        <Route path="records" element={} />
        <Route path="chat_support" element={} /> */}
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

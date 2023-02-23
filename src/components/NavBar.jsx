import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { Outlet, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  // const [authenticated, setAuthenticated] = useState(sessionStorage.getItem('authenticated'));

  useEffect(() => {
    document.querySelector('#root').classList.remove('flex', 'flex-row')
    document.querySelector('#root').classList.add('flex', 'flex-col')

    // if (authenticated === 'true') {
    //   navigate('./../admin/');
    // }

  }, []);

  const handleResize = () => {
    if (window.innerWidth > 1024) {
      setActive(false);
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  return (
    <>
      <nav className='sticky top-0 w-screen h-28 flex flex-row justify-between items-center bg-white shadow-md z-20 py-4'>
        <a href="/" className='flex flex-row justify-center items-center mx-12 w-fit'>
          <p className='font-bold text-xl px-2 w-fit'>Sicat Dental Clinic</p>
        </a>
        <button
          className="flex flex-row justify-end items-center gap-8 p-2 mx-20 w-auto text-3xl lg:hidden"
          title="Navbar"
          type="button"
          onClick={() => {
            setActive(!active);
          }}
        >
          <Icon icon="clarity:bars-line" />
        </button>
        <ul className={`
        ${(window.innerWidth < 1024) ? (active ? 'fixed flex flex-col justify-center items-center gap-4 right-0 py-4 bg-white top-28 w-full shadow-md' : 'hidden') : 'hidden'}
        lg:flex lg:flex-row lg:justify-end lg:items-center lg:gap-8 lg:mx-12 lg:w-auto lg:h-full
        `}>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold' : undefined} >Home</NavLink>
          </li>
          <li>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Services</NavLink>
          </li>
          <li>
            <NavLink to="/products" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Products</NavLink>
          </li>
          <li>
            <NavLink to="/about-us" className={({ isActive }) => isActive ? 'font-bold' : undefined}>About Us</NavLink>
          </li>
          <li>
            <NavLink to="/contact-us" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Contact Us</NavLink>
          </li>
          <li>
            <NavLink to="/login" className="px-8 py-1 bg-sadp-brown border-2 border-sadp-brown text-white rounded-lg">Login</NavLink>
          </li>
        </ul>
      </nav>

      <Outlet />

    </>
  )
};

export default NavBar
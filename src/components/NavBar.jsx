import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { Outlet, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  // const [authenticated, setAuthenticated] = useState(sessionStorage.getItem('authenticated'));

  useEffect(() => {

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
    <div className="flex flex-col">
      <nav className='sticky top-0 h-28 w-full flex flex-row justify-between items-center bg-white z-20 py-4'>
        <a href="/" className='flex flex-row justify-center items-center mx-12 w-fit'>
          <img className='w-auto h-14' src="Logo.png" alt="Sicat Dental Clinic Logo" />
          <p className='font-bold text-xl px-2 w-fit text-secondary'>Sicat Dental Clinic</p>
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
        <div className={`
        ${(window.innerWidth < 1024) ? (active ? 'fixed flex flex-col justify-center items-center gap-6 right-0 py-8 bg-white top-24 w-full' : 'hidden') : 'hidden'}
        lg:flex lg:flex-row lg:justify-end lg:items-center lg:gap-8 lg:mx-12 lg:w-auto lg:h-full
        `}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold' : undefined} >Home</NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Services</NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Products</NavLink>
          <NavLink to="/about-us" className={({ isActive }) => isActive ? 'font-bold' : undefined}>About Us</NavLink>
          <NavLink to="/contact-us" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Contact Us</NavLink>
          <NavLink to="/login" className="px-8 py-1 bg-secondary border-2 border-black text-white font-bold rounded-lg drop-shadow-primary transition hover:translate-x-1 hover:translate-y-1 hover:drop-shadow-none active:bg-secondary-active">Login</NavLink>
        </div>
        {/* <ul className={`
        ${(window.innerWidth < 1024) ? (active ? 'fixed flex flex-col justify-center items-center gap-6 right-0 py-8 bg-white top-24 w-full' : 'hidden') : 'hidden'}
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
            <NavLink to="/login" className="px-8 py-1 bg-secondary border-2 border-black text-white font-bold rounded-lg drop-shadow-primary transition hover:translate-x-1 hover:translate-y-1 hover:drop-shadow-none active:bg-secondary-active">Login</NavLink>
          </li>
        </ul> */}
      </nav>

      <div className="w-full h-full">
        <Outlet />
      </div>

      <div className="w-full h-64 bg-black mt-12 flex flex-col justify-center items-center gap-4">
        <p className="text-tertiary text-2xl font-bold">Sicat Dental Clinic</p>
        <p className="text-white">1337 Myriam Spur, Haneborough, Burkina Faso</p>
        <div className="flex flex-row gap-4">
          <a href="" className="bg-white rounded-full p-2">
            <Icon icon="bxl:facebook" className="text-black text-2xl" />
          </a>
          <a href="" className="bg-white rounded-full p-2">
            <Icon icon="bxl:twitter" className="text-black text-2xl" />
          </a>
        </div>
        <p className="text-white">2023 © Sicat Dental Clinic</p>
      </div>

    </div>
  )
};

export default NavBar
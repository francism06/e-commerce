import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { Outlet, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../config/firebase";
import {
  doc,
  query,
  collection,
  where,
  getCountFromServer
} from "firebase/firestore";


import { PrimaryButton } from "./Elements";

const NavBar = () => {
  const [active, setActive] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const handleResize = () => {
    if (window.innerWidth > 1024) {
      setActive(false);
    }
  }

  /**
   * Checks if the user is admin then redirects to dashboard
  */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDetails = JSON.parse(localStorage.getItem('user'));

        if (user.uid !== userDetails.uid) {
          localStorage.clear();
          signOut(auth).then(() => location.reload());
          return;
        }

        setUser(userDetails);
      } else {
        localStorage.clear();
      }
    });
  }, []);

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      const isAdmin = user.is_admin;

      isAdmin && navigate('/admin');

      const getCartCount = async () => {
        const itemRef = doc(db, 'users', user.uid);
        const itemQuery = query(collection(itemRef, 'items'), where('delivery_status', '==', null));
        const itemSnap = await getCountFromServer(itemQuery);

        setCartCount(itemSnap.data().count);
      }

      getCartCount();
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <nav className='sticky top-4 h-22 md:w-[95%] w-3/4 flex flex-row justify-between items-center bg-white z-20 py-4 border-2 border-black drop-shadow-primary text-xs xl:text-sm'>
        <a href="/" className='flex flex-row justify-center items-center mx-6 lg:mx-12 w-fit'>
          <img className='w-auto h-14' src="/Logo.png" alt="Sicat Dental Clinic Logo" />
          <p className='font-bold xl:text-xl px-2 w-fit text-secondary'>Sicat Dental Clinic</p>
        </a>
        <button
          className="flex flex-row justify-end items-center gap-8 p-2 mx-6 lg:mx-20 w-auto text-3xl lg:hidden"
          title="Navbar"
          type="button"
          onClick={() => {
            setActive(!active);
          }}
        >
          <Icon icon="clarity:bars-line" />
        </button>
        <div className={`
        ${(window.innerWidth < 1024) ? (active ? 'fixed flex flex-col justify-center items-center gap-6 right-0 py-8 bg-white top-28 w-full border-2 border-black' : 'hidden') : 'hidden'}
        lg:flex lg:flex-row lg:justify-end lg:items-center lg:gap-8 lg:mx-12 lg:w-auto lg:h-full
        `}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold' : undefined} >Home</NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Services</NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Products</NavLink>
          <NavLink to="/about-us" className={({ isActive }) => isActive ? 'font-bold' : undefined}>About Us</NavLink>
          <NavLink to="/contact-us" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Contact Us</NavLink>
          {
            (user !== null && Object.keys(user).length !== 0) ? (
              <div className="flex flex-row justify-center items-center gap-4">
                <NavLink className={`relative`} to={"/cart"}>
                  <p className="absolute w-6 h-6 bg-red-500 rounded-full bottom-3 left-3 text-white flex justify-center items-center z-[1]">{cartCount}</p>
                  <Icon icon="material-symbols:shopping-bag-outline" className="text-2xl" />
                </NavLink>
                <NavLink to={"/profile"} className={`font-bold`}>{user.email}</NavLink>
              </div>
            ) : (
              <PrimaryButton label={'Login'} location={'/login'} />
            )
          }
        </div>
      </nav>

      <div className="w-full py-12 min-h-screen flex flex-col">
        <Outlet />
      </div>

      <div className="w-full h-64 bg-black flex flex-col justify-center items-center gap-4">
        <p className="text-tertiary text-2xl font-bold">Sicat Dental Clinic</p>
        <p className="text-white">Conception, Tarlac City</p>
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
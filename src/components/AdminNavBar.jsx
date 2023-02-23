import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Outlet, NavLink } from "react-router-dom";

const AdminNavBar = () => {
    const navigate = useNavigate();
    // const [authenticated, setAuthenticated] = useState(sessionStorage.getItem('authenticated'))

    // useEffect(() => {
    //     document.querySelector('#root').classList.remove('flex', 'flex-col')
    //     document.querySelector('#root').classList.add('flex', 'flex-row')
    //     if (authenticated !== 'true') {
    //         navigate('/');
    //     }
    // }, []);

    // const handleLogout = () => {
    //     sessionStorage.setItem('authenticated', null);
    // }

    return (
        <>
            <nav className="fixed left-0 top-0 flex flex-col min-h-[100vh] min-w-[318px] max-w-[318px] py-5 px-7 gap-8 bg-sadp-brown">
                <a href="/admin" className='flex flex-row justify-center items-center bg-white rounded-lg py-1 px-5 gap-4'>
                    <img className='w-1/4' src="/assets/sadpp_logo.png" alt="San Antonio De Padua Parish Logo" />
                    <p className='font-bold text-base px-2 text-sadp-brown'>San Antonio de Padua</p>
                </a>

                <ul className="flex flex-col flex-1 gap-2 text-purple-300/40">
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink className={({ isActive }) => isActive ? 'flex flex-row gap-5 font-bold text-white w-full px-2 py-4' : 'flex flex-row gap-5 w-full px-2 py-4'} to="/admin" end>
                            <Icon icon="clarity:home-line" className='text-2xl' />
                            <p>Dashboard</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/events" className={({ isActive }) => isActive ? 'flex flex-row gap-5 font-bold text-white w-full px-2 py-4' : 'flex flex-row gap-5 w-full px-2 py-4'}>
                            <Icon icon="clarity:calendar-line" className='text-2xl' />
                            <p>Events</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/services" className={({ isActive }) => isActive ? 'flex flex-row gap-5 font-bold text-white w-full px-2 py-4' : 'flex flex-row gap-5 w-full px-2 py-4'}>
                            <Icon icon="clarity:cog-line" className='text-2xl' />
                            <p>Services</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/records" className={({ isActive }) => isActive ? 'flex flex-row gap-5 font-bold text-white w-full px-2 py-4' : 'flex flex-row gap-5 w-full px-2 py-4'}>
                            <Icon icon="clarity:clipboard-line" className='text-2xl' />
                            <p>Records</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/chat_support" className={({ isActive }) => isActive ? 'flex flex-row gap-5 font-bold text-white w-full px-2 py-4' : 'flex flex-row gap-5 w-full px-2 py-4'}>
                            <Icon icon="clarity:clipboard-line" className='text-2xl' />
                            <p>Chat Support</p>
                        </NavLink>
                    </li>

                    <li onClick={handleLogout} className="flex flex-row items-center gap-5 cursor-pointer mt-auto">
                        <NavLink to="/" className="flex flex-row gap-5">
                            <Icon icon="clarity:sign-out-line" className='text-2xl' />
                            <p>Sign Out</p>
                        </NavLink>
                    </li>

                </ul>
            </nav>

            <Outlet />

        </>
    )
}

export default AdminNavBar;
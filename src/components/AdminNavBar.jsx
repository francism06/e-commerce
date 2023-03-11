import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Outlet, NavLink } from "react-router-dom";

const AdminNavBar = () => {
    const [active, setActive] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const navigate = useNavigate();

    const handleLogout = (event) => {
        localStorage.clear();
    }

    /**
     * Checks if the user is admin then redirects to dashboard
     */
    useEffect(() => {

        if (user === null) {
            navigate('/')
        }

        if (user !== null && Object.keys(user).length !== 0) {
            const isAdmin = user.is_admin;

            !isAdmin && navigate('/');
        }

    }, [user]);

    return (
        <>
            <nav className="fixed bg-secondary left-0 top-0 flex flex-col min-h-[100vh] min-w-[318px] max-w-[318px] py-5 px-7 gap-8 bg-sadp-brown">
                <a href="/admin" className='flex flex-row justify-center items-center bg-white rounded-lg py-1 px-5 gap-4'>
                    <img className='w-auto h-10' src="/Logo.png" alt="Sicat Dental Clinic Logo" />
                    <p className='font-bold text-base px-2 text-sadp-brown'>Sicat Dental Clinic</p>
                </a>

                <ul className="flex flex-col flex-1 gap-2">
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink className={({ isActive }) => isActive ? 'flex flex-row gap-5 font-bold text-white w-full px-2 py-4' : 'flex flex-row gap-5 w-full px-2 py-4'} to="/admin" end>
                            <Icon icon="clarity:home-line" className='text-2xl' />
                            <p>Dashboard</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/services" className={({ isActive }) => isActive ? 'flex flex-row gap-5 font-bold text-white w-full px-2 py-4' : 'flex flex-row gap-5 w-full px-2 py-4'}>
                            <Icon icon="clarity:calendar-line" className='text-2xl' />
                            <p>Services</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'flex flex-row gap-5 font-bold text-white w-full px-2 py-4' : 'flex flex-row gap-5 w-full px-2 py-4'}>
                            <Icon icon="clarity:cog-line" className='text-2xl' />
                            <p>Products</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/transactions" className={({ isActive }) => isActive ? 'flex flex-row gap-5 font-bold text-white w-full px-2 py-4' : 'flex flex-row gap-5 w-full px-2 py-4'}>
                            <Icon icon="clarity:clipboard-line" className='text-2xl' />
                            <p>Transactions</p>
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

            <div className="w-full h-full pl-[318px]">
                <Outlet />
            </div>

        </>
    )
}

export default AdminNavBar;
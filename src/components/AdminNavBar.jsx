import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const AdminNavBar = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.clear();
        await signOut(auth).then(() => location.reload());
    };

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
                navigate('/');
            }
        });
    }, []);

    useEffect(() => {
        if (Object.keys(user).length !== 0) {
            const isAdmin = user.is_admin;

            !isAdmin && navigate('/');
        }
    }, [user]);

    // useEffect(() => {
    //     if (user !== null && Object.keys(user).length !== 0) {
    //         const isAdmin = user.is_admin;

    //         !isAdmin && navigate('/');
    //     }
    // }, []);

    return (
        <>
            <nav className="fixed bg-white border-r border-slate-200 left-0 top-0 flex flex-col min-h-[100vh] min-w-[318px] max-w-[318px] py-5 px-7 gap-8">
                <a href="/admin" className='flex flex-row justify-center items-center bg-white  py-1 px-5 gap-4'>
                    <img className='w-auto h-10' src="/Logo.png" alt="Sicat Dental Clinic Logo" />
                    <p className='font-bold text-base text-secondary'>Sicat Dental Clinic</p>
                </a>

                <ul className="flex flex-col flex-1 gap-2">
                    <li className="flex flex-row items-center gap-5 cursor-pointer">
                        <NavLink to="/admin" className={({ isActive }) => { return (isActive ? 'text-white bg-secondary rounded-md font-bold ' : '') + 'flex flex-row gap-5 w-full px-2 py-4' }} end>
                            <Icon icon="clarity:home-line" className='text-2xl' />
                            <p>Dashboard</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/services" className={({ isActive }) => { return (isActive ? 'text-white bg-secondary rounded-md font-bold ' : '') + 'flex flex-row gap-5 w-full px-2 py-4' }}>
                            <Icon icon="clarity:calendar-line" className='text-2xl' />
                            <p>Services</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/products" className={({ isActive }) => { return (isActive ? 'text-white bg-secondary rounded-md font-bold ' : '') + 'flex flex-row gap-5 w-full px-2 py-4' }}>
                            <Icon icon="clarity:cog-line" className='text-2xl' />
                            <p>Products</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/transactions" className={({ isActive }) => { return (isActive ? 'text-white bg-secondary rounded-md font-bold ' : '') + 'flex flex-row gap-5 w-full px-2 py-4' }}>
                            <Icon icon="clarity:clipboard-line" className='text-2xl' />
                            <p>Transactions</p>
                        </NavLink>
                    </li>
                    <li className="flex flex-row items-center gap-5 cursor-pointer ">
                        <NavLink to="/admin/manage-users" className={({ isActive }) => { return (isActive ? 'text-white bg-secondary rounded-md font-bold ' : '') + 'flex flex-row gap-5 w-full px-2 py-4' }}>
                            <Icon icon="clarity:user-solid" className='text-2xl' />
                            <p>Manage Users</p>
                        </NavLink>
                    </li>

                    <li onClick={handleLogout} className="flex flex-row items-center gap-5 cursor-pointer mt-auto">
                        <NavLink to="/" className="flex flex-row gap-5 text-red-500">
                            <Icon icon="clarity:sign-out-line" className='text-2xl' />
                            <p>Sign Out</p>
                        </NavLink>
                    </li>

                </ul>
            </nav>

            <div className="w-full min-h-screen pl-[318px] bg-gray-100">
                <Outlet />
            </div>

        </>
    )
}

export default AdminNavBar;

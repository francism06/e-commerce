import React, { useState, useEffect } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import {
    doc,
    getDoc
} from 'firebase/firestore';

const ViewUser = () => {
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    let { state } = useLocation();

    useEffect(() => {
        if (!id) {
            navigate('../manage-users');
            location.reload();
        }

        const checkUserDetails = async () => {
            const docRef = doc(db, 'users', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                navigate('../manage-users');
                location.reload();
            }

            setUserDetails(state.user);
        };

        checkUserDetails();
    }, []);

    if (Object.keys(userDetails).length === 0) {
        return (
            <div className="px-8">
                <div className='flex flex-col p-8 gap-2 w-full h-36 bg-slate-100 animate-pulse'>
                    <div className="w-full h-8 bg-slate-300"></div>
                    <div className="w-full h-8 bg-slate-300"></div>
                    <div className="w-full h-8 bg-slate-300"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col gap-4 p-12">
            <div className="flex flex-row w-full justify-between items-center">
                <p className="font-bold text-secondary">User</p>
            </div>
            <div className="flex flex-col w-full p-4 gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col w-full">
                        <label htmlFor="first_name">Full Name</label>
                        <p className="border border-slate-400 p-2 bg-white">{`${userDetails.first_name} ${userDetails.last_name}`}</p>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email_address">Email Address</label>
                        <p className="border border-slate-400 p-2 bg-white">{userDetails.email_address ? userDetails.email_address : 'No email address provided.'}</p>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="contact_number">Contact Number</label>
                        <p className="border border-slate-400 p-2 bg-white">{userDetails.contact_number ? userDetails.contact_number : 'No contact number provided.'}</p>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="address">Address</label>
                        <p className="border border-slate-400 p-2 bg-white">{userDetails.address ? userDetails.address : 'No address provided.'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewUser;
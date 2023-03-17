import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../config/firebase";
import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";

import { PrimaryButton } from "../../components/Elements";


/**
 * first_name
 * last_name
 * email_address
 * password
 * address
 * contact_number
 * role
 * profile_photo
 */

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (confirmPassword === password) {
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Stores email and UID
                    const { email, uid } = userCredential.user;
    
                    // Stores to Firestore Database
                    try {
                        await setDoc(doc(db, 'users', uid), {
                            first_name: firstName,
                            last_name: lastName,
                            email_address: email,
                            address: address,
                            contact_number: contactNumber,
                            is_admin: false
                        });
    
                        navigate('/login');
                    } catch (error) {
                        console.error('Error adding document:', error);
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
    
                    console.error(errorCode, errorMessage);
                });
    
            location.reload();
        } else {
            console.error('Password and Confirm Password is not the same!');
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user !== null && Object.keys(user).length !== 0) {
            navigate('/');
        }
    }, []);

    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            <div className="w-3/5 py-12 flex justify-center items-center bg-white border-4 border-black drop-shadow-primary ">
                <form onSubmit={handleSubmit} className="w-3/4 flex flex-col justify-center items-center gap-8">
                    <div className="flex w-full">
                        <p className="text-2xl font-bold">Sign Up</p>
                    </div>
                    <div className="flex flex-col w-full gap-4">
                        <div className="flex flex-row gap-4 w-full">
                            <div className="w-2/4">
                                <label htmlFor="first_name">First Name</label>
                                <input onInput={(event) => setFirstName(event.target.value)} className="w-full p-2 border-4 border-black  outline-none focus:drop-shadow-tertiary" type="text" name="first_name" id="first_name" />
                            </div>
                            <div className="w-2/4">
                                <label htmlFor="last_name">Last Name</label>
                                <input onInput={(event) => setLastName(event.target.value)} className="w-full p-2 border-4 border-black  outline-none focus:drop-shadow-tertiary" type="text" name="last_name" id="last_name" />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <div className="w-3/4">
                                <label htmlFor="email_address">Email Address</label>
                                <input onInput={(event) => setEmail(event.target.value)} className="w-full p-2 border-4 border-black  outline-none focus:drop-shadow-tertiary" type="email" name="email_address" id="email_address" />
                            </div>
                            <div className="w-1/4">
                                <label htmlFor="contact_number">Contact Number</label>
                                <input onInput={(event) => setContactNumber(event.target.value)} className="w-full p-2 border-4 border-black  outline-none focus:drop-shadow-tertiary" type="text" name="contact_number" id="contact_number" />
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="address">Address</label>
                            <textarea onInput={(event) => setAddress(event.target.value)} className="p-2 border-4 border-black  outline-none focus:drop-shadow-tertiary resize-none" name="address" id="address" cols="30" rows="3"></textarea>
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="password">Password</label>
                            <input onInput={(event) => setPassword(event.target.value)} className="p-2 border-4 border-black  outline-none focus:drop-shadow-tertiary" type="password" name="password" id="password" autoComplete="off" />
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <input onInput={(event) => setConfirmPassword(event.target.value)} className="p-2 border-4 border-black  outline-none focus:drop-shadow-tertiary" type="password" name="confirm_password" id="confirm_password" autoComplete="off" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4">
                        <PrimaryButton label={'Register'} />
                        <p>Already have an account? <NavLink to={'/login'} className={'underline'}>Login</NavLink></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
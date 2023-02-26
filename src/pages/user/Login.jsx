import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    getDoc,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { PrimaryButton } from "../../components/Elements";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in 
                const { email, uid } = userCredential.user;

                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const { is_admin } = docSnap.data();

                    // Stores to session
                    localStorage.setItem('user', JSON.stringify({ email, uid, is_admin }));
                } else {
                    console.error('No data exists!');
                }

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error(errorCode, errorMessage);
            });

        location.reload();
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user !== null && Object.keys(user).length !== 0) {
            navigate('/');
        }
    }, []);

    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            <div className="w-3/5 h-4/5 flex flex-row bg-white border-2 border-black drop-shadow-primary rounded-lg">
                <div className="w-2/4 h-full border-r-2 border-black flex justify-center items-center">
                    <img src="Logo.png" alt="Sicat Dental Clinic Logo" />
                </div>
                <div className="w-2/4 h-full flex justify-center">
                    <form onSubmit={handleSubmit} className="w-3/4 flex flex-col justify-center items-center gap-8">
                        <div className="flex w-full">
                            <p className="text-2xl font-bold">Welcome</p>
                        </div>
                        <div className="flex flex-col w-full gap-4">
                            <div className="flex flex-col w-full">
                                <label htmlFor="email_address">Email</label>
                                <input onInput={(event) => setEmail(event.target.value)} className="p-2 border-2 border-black rounded-lg outline-none focus:drop-shadow-tertiary" type="text" name="email_address" id="email_address" autoComplete="email" />
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="password">Password</label>
                                <input onInput={(event) => setPassword(event.target.value)} className="p-2 border-2 border-black rounded-lg outline-none focus:drop-shadow-tertiary" type="password" name="password" id="password" autoComplete="current-password" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-4">
                            <PrimaryButton label={'Login'} />
                            <p>Don't have an account? <NavLink to={'/register'} className={'underline'}>Register</NavLink></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
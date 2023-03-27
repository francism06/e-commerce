import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";

/**
 * User Details
 * 
 * first_name
 * last_name
 * password
 * address
 * contact_number
 * email_address
 * role
 * profile_photo
 */

const ManageUsers = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const docRef = collection(db, 'users');
            const docSnap = await getDocs(docRef);

            const temp = new Array();

            docSnap.forEach((doc) => {
                temp.push({ docId: doc.id, ...doc.data() })
            });

            setUserList(temp);
        };

        getUsers();
    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-4 p-12">
            <div className="flex flex-row w-full justify-between items-center">
                <p className="font-bold text-secondary">Manage Users</p>
            </div>
            <div className="flex flex-col w-full h-full">
                <table className="w-full table-fixed border-separate border-spacing-y-2">
                    <thead>
                        <tr className="bg-black drop-shadow-sm text-white">
                            <th className="p-4 text-left border-l border-y border-slate-200">Name</th>
                            <th className="p-4 text-left border-y border-slate-200">Email Address</th>
                            <th className="p-4 border-r-2 border-y border-slate-200">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userList.length ? (
                                userList.map((user, index) => {
                                    return (
                                        <tr className="bg-white border drop-shadow-sm text-center" key={index}>
                                            <td className="p-4 text-left border-l border-y border-slate-200">
                                                <p>{`${user.first_name} ${user.last_name}`}</p>
                                            </td>
                                            <td className="p-4 border-y border-slate-200 text-left">
                                                <p>{user.email_address}</p>
                                            </td>
                                            <td className="p-4 text-center border-r-2 border-y border-slate-200">
                                                <div className="flex w-full h-full justify-center items-center">
                                                    <Link className="px-4 py-2 border border-secondary text-secondary" state={{ user: user }} to={`${user.docId}`} >View</Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">No users!</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageUsers;
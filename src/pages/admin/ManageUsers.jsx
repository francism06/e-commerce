import React, { useState, useEffect } from "react";
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
    return (
        <div>ManageUsers</div>
    )
}

export default ManageUsers;
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  doc,
  getDoc
} from "firebase/firestore";

const Profile = () => {
  const [profileDetails, setProfileDetails] = useState({});
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleSaveProfile = () => {
    console.log('Save');
    handleEditProfile();
  };

  const handleEditPassword = () => {
    console.log('Edit password');
  };

  const handleLogout = () => {
    localStorage.clear();
    location.reload();
  };

  useEffect(() => {
    if (user === null) {
      navigate('/');
    }

    if (user !== null && Object.keys(user).length !== 0) {
      const isAdmin = user.is_admin;

      isAdmin && navigate('/admin');
    }

  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-8 px-24">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <p className="font-bold">My Profile</p>
            <p className="font-light">Manage your account.</p>
          </div>
          <div>
            <button className="bg-red-500 border-2 border-black text-white px-4 py-2" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="flex flex-col w-full bg-white border-2 border-black p-4 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <div className="flex flex-col w-full">
                <label htmlFor="first_name">First Name</label>
                <input className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="text" name="first_name" id="first_name" disabled={!isEditing} />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="last_name">Last Name</label>
                <input className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="text" name="last_name" id="last_name" disabled={!isEditing} />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="email_address">Email Address</label>
              <input className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="text" name="email_address" id="email_address" disabled={!isEditing} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="contact_number">Contact Number</label>
              <input className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="text" name="contact_number" id="contact_number" disabled={!isEditing} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="address">Address</label>
              <input className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="text" name="address" id="address" disabled={!isEditing} />
            </div>
          </div>
          {
            isEditing ? (
              <div className="flex flex-row gap-4 justify-end">
                <button onClick={handleEditProfile} className="border-2 border-black bg-white px-4 py-2">Cancel</button>
                <button onClick={handleSaveProfile} className="border-2 border-black bg-white px-4 py-2">Save</button>
              </div>

            ) : (
              <div className="flex flex-row gap-4 justify-end">
                <button onClick={handleEditPassword} className="border-2 border-black bg-white px-4 py-2">Change Password</button>
                <button onClick={handleEditProfile} className="border-2 border-black bg-white px-4 py-2">Edit Profile</button>
              </div>
            )
          }
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="flex flex-col">
          <p className="font-bold">Recent Purchased Products</p>
        </div>
        <table>
          <thead>
            <tr className="text-white bg-black">
              <th>Order Number</th>
              <th>Product Name</th>
              <th>Date of Purchase</th>
              <th>Status</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              
            }
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default Profile;
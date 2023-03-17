import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  doc,
  getDoc
} from "firebase/firestore";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

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
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
};

export default Profile;
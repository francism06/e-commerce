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

function Dashboard() {
  return (
    <div className="w-full">
      <p>Dashboard</p>
    </div>
  )
}

export default Dashboard;

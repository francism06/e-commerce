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
 * Service Details
 * 
 * name
 * description
 * image
 * price_start
 * price_end - nullable
 * tags
 * note
 */

const Services = () => {
  return (
    <div>Services</div>
  )
}

export default Services;
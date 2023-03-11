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
 * Transaction details
 * 
 * transaction_id
 * user_id
 * address
 * contact_number
 * item_id
 * quantity
 * price
 * date_bought
 * date_received
 * status
 */

const Transactions = () => {
  return (
    <div>Transactions</div>
  )
};

export default Transactions;
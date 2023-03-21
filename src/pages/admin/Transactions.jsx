import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  collection,
  collectionGroup,
  query,
  where,
  orderBy
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

const convertString = (string) => {
  return string !== '' && (string.charAt(0).toUpperCase() + string.slice(1)).replaceAll('_', ' ');
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const getTransactions = async () => {
      const q = query(collectionGroup(db, 'items'), where('is_paid', '==', true));
      const querySnapshot = await getDocs(q);

      const temp = [];

      querySnapshot.forEach((doc) => {
        temp.push({ userRef: doc.ref.parent.parent.id, docId: doc.id, ...doc.data() });
      });

      setTransactions(temp);
    };

    getTransactions();
  }, []);

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* {
            transactions.length && (
              transactions.map((transaction, index) => {
                return (
                  <tr key={index}>
                    <td><p>Test</p></td>
                  </tr>
                )
              })
            )
          } */}
        </tbody>
      </table>
    </div>
  )
};

export default Transactions;
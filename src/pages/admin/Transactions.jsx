import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { Link } from "react-router-dom";
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

const PAYMENT_METHOD = [
  {
    label: 'Cash on Delivery',
    method: 'cod'
  },
  {
    label: 'PayPal',
    method: 'paypal'
  }
];

const DELIVERY_STATUS = [
  {
    status: 'order_placed',
    name: 'Order Placed',
    description: 'Order has been placed.',
  },
  {
    status: 'order_packed',
    name: 'Order Packed',
    description: 'Order has been packed.'
  },
  {
    status: 'order_shipped',
    name: 'Order Shipped',
    description: 'Order has been shipped.'
  },
  {
    status: 'order_delivered',
    name: 'Order Delivered',
    description: 'Order has been delivered.'
  }
];

const convertString = (string) => {
  return string !== '' && (string.charAt(0).toUpperCase() + string.slice(1)).replaceAll('_', ' ');
};

const getPaymentMethod = (value) => {
  return PAYMENT_METHOD[PAYMENT_METHOD.findIndex((payment) => payment.method === value)]?.label;
};

const convertDateToString = (date) => {
  return `${new Date(date).toDateString()} | ${new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

// const getDeliveryStatus = (value) => {
//   const index = DELIVERY_STATUS
// }

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const getTransactions = async () => {
      const q = query(collectionGroup(db, 'items'), where('delivery_status', 'in', ['order_placed', 'order_packed', 'order_shipped', 'order_delivered']), orderBy('date_created', 'desc'));
      const querySnapshot = await getDocs(q);

      const temp = [];

      querySnapshot.forEach((doc) => {
        temp.push({ userRef: doc.ref.parent.parent.id, docId: doc.id, ...doc.data() });
      });

      setTransactions(temp);
    };

    getTransactions();
  }, []);

  if (!transactions.length) {
    return (
      <div className='p-8'>
        <div className="flex flex-col p-8 gap-2 w-full h-36 bg-slate-200 animate-pulse">
          <div className="w-full h-8 bg-slate-300"></div>
          <div className="w-full h-8 bg-slate-300"></div>
          <div className="w-full h-8 bg-slate-300"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-12">
      <div className="flex flex-row w-full justify-between items-center">
        <p className="font-bold text-secondary">Transactions</p>
      </div>
      <table className="w-full text-center table-fixed border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-4 text-left border-l border-y border-slate-200">Order ID</th>
            <th className="p-4 border-y border-slate-200">Order Date</th>
            <th className="p-4 border-y border-slate-200">Payment Method</th>
            <th className="p-4 border-y border-slate-200">Total</th>
            <th className="p-4 border-y border-slate-200">Status</th>
            <th className="p-4 border-r border-y border-slate-200">Payment</th>
          </tr>
        </thead>
        <tbody>
          {
            transactions.length && (
              transactions.map((transaction, index) => {
                const time = new Date(transaction.date_created.seconds * 1000 + transaction.date_created.nanoseconds / 1000000).toLocaleDateString();

                console.log(transaction);

                return (
                  <tr key={index} className="bg-white">
                    <td className="p-4 text-left border-l border-y border-slate-200"><Link className="text-blue-400 underline" to={transaction.docId} state={{ transactionDetails: transaction }}>{transaction.docId}</Link></td>
                    <td className="p-4 border-y border-slate-200"><p>{time}</p></td>
                    <td className="p-4 border-y border-slate-200"><p>{getPaymentMethod(transaction.payment_method)}</p></td>
                    <td className="p-4 border-y border-slate-200"><p>₱ {transaction.total_price}</p></td>
                    <td className="p-4 border-y border-slate-200"><p>{convertString(transaction.delivery_status)}</p></td>
                    <td className={`p-4 border-r border-y border-slate-200`}>
                      <div className="flex justify-center items-center w-full h-full">
                        <p className={`w-fit rounded-full border px-4 py-2 ${transaction.is_paid ? 'border-green-500 text-green-500 bg-green-100' : 'border-red-500 text-red-500 bg-red-100'}`}>{transaction.is_paid ? 'Fulfilled' : 'Unfulfilled'}</p>
                      </div>
                    </td>
                  </tr>
                )
              })
            )
          }
        </tbody>
      </table>
    </div>
  )
};

export default Transactions;
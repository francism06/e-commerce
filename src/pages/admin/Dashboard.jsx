import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import {
  collection,
  collectionGroup,
  getDocs,
  where,
  orderBy,
  query,
  getCountFromServer,
  doc,
} from "firebase/firestore";

const CARD_COLOR = [
  'bg-red-300',
  'bg-blue-300',
  'bg-green-300',
  'bg-yellow-300',
  'bg-purple-300',
  'bg-indigo-300',
];

const randomizer = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const DashboardCard = ({ contents = null, color = null }) => {
  return (
    <div className={`${color ? color : 'bg-white'} w-full h-48 flex flex-col justify-center drop-shadow-md rounded-lg p-8`}>
      <p className="font-bold text-6xl text-slate-900">{contents.body}</p>
      <p className="text-lg text-slate-700">{contents.title}</p>
    </div>
  )
};

const Dashboard = () => {
  const [productsSold, setProductsSold] = useState([]);
  const [details, setDetails] = useState([]);

  const getTotalSales = (items) => {
    const temp = [...items];
    const total = temp.reduce((accumulator, currValue) => {
      return currValue.is_paid ? accumulator + currValue.total_price : accumulator;
    }, 0);

    setDetails((prevState) => {
      return [
        ...prevState,
        {
          title: 'Total Revenue',
          body: '₱ ' + total
        }
      ]
    })
  };

  const getNumberOfOrders = (items) => {
    const temp = [...items];
    const numberOfFulfilledOrders = temp.filter((item) => item.is_paid === true).length;
    const numberOfUnfulfilledOrders = temp.filter((item) => item.is_paid === false).length;
    setDetails((prevState) => {
      return [
        ...prevState,
        {
          title: 'Number of Fulfilled Orders',
          body: numberOfFulfilledOrders
        },
        {
          title: 'Number of Unfulfilled Orders',
          body: numberOfUnfulfilledOrders
        }
      ]
    })
  };

  const getNumberOfUsers = async () => {
    const docRef = collection(db, 'users');
    const docSnap = await getCountFromServer(docRef);
    setDetails((prevState) => {
      return [
        ...prevState,
        {
          title: 'Number of Users',
          body: docSnap.data().count
        }
      ]
    });
  };

  const getNumberOfProducts = async () => {
    const docRef = collection(db, 'products');
    const docSnap = await getCountFromServer(docRef);
    setDetails((prevState) => {
      return [
        ...prevState,
        {
          title: 'Number of Products',
          body: docSnap.data().count
        }
      ]
    });
  };

  const getNumberOfServices = async () => {
    const docRef = collection(db, 'services');
    const docSnap = await getCountFromServer(docRef);
    setDetails((prevState) => {
      return [
        ...prevState,
        {
          title: 'Number of Services',
          body: docSnap.data().count
        }
      ]
    });
  };

  useEffect(() => {
    const getProductsSold = async () => {
      const q = query(collectionGroup(db, 'items'), where('delivery_status', 'in', ['order_placed', 'order_packed', 'order_shipped', 'order_delivered']), orderBy('date_created', 'desc'));
      const querySnapshot = await getDocs(q);

      const temp = [];

      querySnapshot.forEach((doc) => {
        temp.push({ userRef: doc.ref.parent.parent.id, docId: doc.id, ...doc.data() });
      });

      setProductsSold(temp);
    };

    getProductsSold();
  }, []);

  useEffect(() => {
    if (productsSold.length) {
      getTotalSales(productsSold);
      getNumberOfOrders(productsSold);
      getNumberOfUsers();
      getNumberOfProducts();
      getNumberOfServices();
    }
  }, [productsSold]);

  return (
    <div className="w-full h-full flex flex-col gap-12 p-12">
      <div className="flex flex-row w-full justify-between items-center">
        <p className="font-bold text-secondary">Dashboard</p>
      </div>
      <div className="w-full flex flex-col bg-white drop-shadow-md rounded-lg p-8 border border-slate-200">
        <p className="text-slate-900 text-3xl font-black">Sicat Dental Clinic</p>
        <p className="text-slate-900">0006 F. Timbol st Poblacion, Concepcion Tarlac </p>
      </div>
      <div className="grid grid-cols-3 w-full h-full gap-12">
        {
          details.map((item, index) => {
            return (
              <DashboardCard key={index} color={CARD_COLOR[index]} contents={item} />
            )
          })
        }
      </div>
    </div>
  )
};

export default Dashboard;

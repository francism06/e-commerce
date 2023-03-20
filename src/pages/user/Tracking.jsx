import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  collection,
  query,
  where
} from "firebase/firestore";
import { Icon } from "@iconify/react";

const convertString = (string) => {
  return string !== '' && (string.charAt(0).toUpperCase() + string.slice(1)).replaceAll('_', ' ');
};

const ProgressTracker = ({ state }) => {
  const [deliveryState, setDeliveryState] = useState('');
  const stateIndex = useRef(0);

  const DELIVERY_STATUS = [
    {
      state: 'order_placed',
      properties: {
        icon: "clarity:view-list-line"
      }
    },
    {
      state: 'order_packed',
      properties: {
        icon: "clarity:archive-line"
      }
    },
    {
      state: 'order_shipped',
      properties: {
        icon: "clarity:truck-line"
      }
    },
    {
      state: 'order_delivered',
      properties: {
        icon: "clarity:unarchive-line"
      }
    }
  ];

  useEffect(() => {
    if (state !== undefined || state !== '') {
      setDeliveryState(state);
    }
  }, [state]);

  useEffect(() => {
    if (deliveryState !== undefined && deliveryState !== '') {
      DELIVERY_STATUS.forEach((status, index) => {
        if (status.state === deliveryState) {
          stateIndex.current = index;
        }
      });
    }
  }, [deliveryState]);

  if (deliveryState === undefined || deliveryState === '') {
    return (
      <div>
        <p>No order to track.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-row w-full justify-center items-center py-8">
      {
        DELIVERY_STATUS.map((status, index) => {
          if (index === 0) {
            return (
              <div className={`relative flex flex-col`} key={index}>
                <div className={`flex w-24 h-24 rounded-full border-4 border-black justify-center items-center ${index <= stateIndex.current ? 'bg-black text-white' : 'bg-white'}`}>
                  <Icon className={`text-6xl`} icon={status.properties.icon} />
                </div>
                <p className={`absolute mt-2 top-full text-center`}>{convertString(status.state)}</p>
              </div>
            )
          }

          return (
            <div className={`flex flex-row justify-center items-center`} key={index}>
              <hr className={`border-2 border-black w-32 ${index <= stateIndex.current ? 'border-solid' : 'border-dashed'}`} />
              <div className={`relative flex flex-col `}>
                <div className={`flex w-24 h-24 rounded-full border-4 border-black justify-center items-center ${index <= stateIndex.current ? 'bg-black text-white' : 'bg-white'}`}>
                  <Icon className={` text-6xl`} icon={status.properties.icon} />
                </div>
                <p className={`absolute mt-2 top-full text-center`}>{convertString(status.state)}</p>
              </div>
            </div>
          )
        })
      }
    </div>
  )
};

const Tracking = () => {
  const [productDetails, setProductDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});

  const user = JSON.parse(localStorage.getItem('user'));
  const { id } = useParams();
  let { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || user === null) {
      navigate('/profile');
      location.reload();
    }

    const initializeProductDetails = async () => {
      const userRef = doc(db, 'users', user.uid);
      const docRef = doc(userRef, 'items', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        navigate('/profile');
        location.reload();
      }

      setProductDetails(state.product);
      setUserDetails(state.user);
    };

    initializeProductDetails();
  }, []);

  useEffect(() => {
    console.log(state);
  }, [userDetails]);

  if (Object.keys(productDetails).length === 0 && Object.keys(userDetails).length === 0) {
    return (
      <div className='flex flex-col p-8 gap-2 w-full h-36 bg-slate-100 animate-pulse'>
        <div className="w-full h-8 bg-slate-300"></div>
        <div className="w-full h-8 bg-slate-300"></div>
        <div className="w-full h-8 bg-slate-300"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-8 px-8 2xl:px-24">
      <div className="w-full flex flex-row justify-between bg-white border-2 border-black drop-shadow-primary p-2">
        <Link className="flex flex-row items-center" to={'/profile'}><Icon icon="clarity:angle-line" rotate={3} />Back</Link>
        <div className="flex flex-row items-center">
          <p>ORDER ID:</p>
          <p>{productDetails.docId}</p>
        </div>
      </div>
      <div className="w-full flex flex-row">
        <ProgressTracker state={productDetails.delivery_status} />
      </div>
      <div className="w-full grid grid-cols-2 mt-8">
        <div className="w-full flex flex-col gap-4">
          <p className="text-secondary font-bold">Delivery Address</p>
          <div className="flex flex-col">
            <p className="font-bold">{`${userDetails.first_name} ${userDetails.last_name}`}</p>
            <p className="font-light text-slate-600">{userDetails.contact_number}</p>
            <p className="font-light text-slate-600">{userDetails.email_address}</p>
            <p className="font-light text-slate-600">{userDetails.address}</p>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <p className="text-secondary font-bold">Track your Order</p>
        </div>
      </div>
    </div>
  )
};

export default Tracking;
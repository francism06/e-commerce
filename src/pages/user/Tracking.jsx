import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy
} from "firebase/firestore";
import { Icon } from "@iconify/react";

const convertString = (string) => {
  return string !== '' && (string.charAt(0).toUpperCase() + string.slice(1)).replaceAll('_', ' ');
};

const convertDateToString = (date) => {
  return `${new Date(date).toDateString()} | ${new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const ProgressTracker = ({ state }) => {
  const [deliveryState, setDeliveryState] = useState('');
  const [stateIndex, setStateIndex] = useState(0);

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
      const index = DELIVERY_STATUS.findIndex((status) => status.state === deliveryState);
      setStateIndex(index);
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
          return (
            <div className={`flex flex-row justify-center items-center`} key={index}>
              {
                index !== 0 && (
                  <hr className={`border-2 border-black w-32 ${index <= stateIndex ? 'border-solid' : 'border-dashed'}`} />
                )
              }
              <div className={`relative flex flex-col `}>
                <div className={`flex w-24 h-24 rounded-full border-2 border-black justify-center items-center ${index <= stateIndex ? 'bg-black text-white' : 'bg-white'}`}>
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
  const [deliveryStatus, setDeliveryStatus] = useState([]);

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

  if (Object.keys(productDetails).length === 0 && Object.keys(userDetails).length === 0) {
    return (
      <div className="w-full px-8">
        <div className='flex flex-col p-8 gap-2 w-full h-36 bg-slate-100 animate-pulse'>
          <div className="w-full h-8 bg-slate-300"></div>
          <div className="w-full h-8 bg-slate-300"></div>
          <div className="w-full h-8 bg-slate-300"></div>
        </div>
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
          <div className="flex flex-col-reverse gap-2 w-full">
            {
              productDetails.status.length ? (
                productDetails.status.map((status, index) => {
                  const date = new Date(status.date_created.seconds * 1000 + status.date_created.nanoseconds / 1000000);
                  const datetime = `${date.toDateString()} | ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

                  return (
                    <div className={`grid grid-cols-2 ${index === (productDetails.status.length - 1) ? '' : 'text-slate-600 font-light'}`} key={index}>
                      <p className={`${index === (productDetails.status.length - 1) ? 'font-bold' : ''}`}>{datetime}</p>
                      <div className="flex flex-col">
                        <p className={`${index === (productDetails.status.length - 1) ? 'font-bold' : ''}`}>{status.name}</p>
                        <p>{status.description}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>
                  <p>No status available.</p>
                </div>
              )
            }
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col border-2 border-black drop-shadow-primary bg-white">
        <div className="p-2 w-full bg-black">
          <p className="text-white font-bold">Your Order</p>
        </div>
        <div className="p-2 w-full flex flex-row">
          <div className="w-24 h-24 overflow-hidden">
            <img className="w-24 h-24 p-4 object-contain" src={productDetails.product_details.images.length ? productDetails.product_details.images[0].url : '/Logo.png'} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-bold">{productDetails.product_details?.name}</p>
            <p>{productDetails.product_details?.description}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full place-content-end">
        <div className="p-2 flex flex-col gap-4 w-2/4 xl:place-self-auto xl:w-1/4 h-full bg-white border-2 border-black drop-shadow-primary">
          <div>
            <p className="font-bold text-lg">Order Summary</p>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <p className="font-bold">Total:</p>
              <p>₱ {productDetails.total_price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Tracking;
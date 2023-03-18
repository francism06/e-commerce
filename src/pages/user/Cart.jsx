import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where
} from "firebase/firestore";

import { PrimaryButton } from "../../components/Elements";
import { ProductCard } from "../../components/ProductCard";

const Cart = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectItem = (event) => {
    console.log(event);
  };

  const handleCheckout = (event) => {
    console.log(selectedItems);
  };

  useEffect(() => {
    if (user === null) {
      navigate('/');
    }

    const getItems = async () => {
      const itemRef = doc(db, 'users', user.uid);
      const itemQuery = query(collection(itemRef, 'items'), where('is_paid', '==', false));
      const itemSnap = await getDocs(itemQuery);

      const temp = [];

      itemSnap.forEach((item) => {
        temp.push(item.data());
      });

      if (temp.length) {
        setCart([...temp]);
      }
    };

    getItems();
  }, []);

  if (!cart.length) {
    return (
      <div className="w-full h-full flex flex-row gap-4 px-12">
        <div className="w-full h-[50vh] flex flex-col justify-center items-center gap-8">
          <p>No items in the cart.</p>
          <PrimaryButton location={'../products'} label={'Shop Now'} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col xl:flex-row gap-4 px-12">
      <div className="w-full xl:w-3/4 h-full flex flex-col gap-8">
        <div className="p-2 w-full flex flex-row justify-between bg-white border-2 border-black drop-shadow-primary">
          <div className="flex flex-row gap-2">
            <input type="checkbox" name="select-all" id="select-all" />
            <p>SELECT ALL ({cart.length} Item/s)</p>
          </div>
          <div>
            <button className="text-red-500" type="button">DELETE</button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {
            cart.map((item, index) => {
              return <ProductCard key={index} index={index} user={user.uid} item={item} handleSelectItem={handleSelectItem} />
            })
          }
        </div>
      </div>
      <div className="p-2 w-full xl:w-1/4 h-full bg-white border-2 border-black drop-shadow-primary border-green-600">
        <button onClick={handleCheckout} className="w-full border-2 border-black px-4 py-2">Checkout</button>
      </div>
    </div>
  )
};

export default Cart;
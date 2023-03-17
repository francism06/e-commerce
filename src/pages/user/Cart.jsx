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

  useEffect(() => {
    console.log(cart);
  }, [cart]);

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
    <div className="w-full h-full flex flex-row gap-4 px-12">
      <div className="w-3/4 h-full flex flex-col gap-8">
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
              return <ProductCard key={index} item={item} />
            })
          }
        </div>
      </div>
      <div className="p-2 w-1/4 h-full bg-white border-2 border-black drop-shadow-primary border-green-600">
        <p>Test</p>
      </div>
    </div>
  )
};

export default Cart;
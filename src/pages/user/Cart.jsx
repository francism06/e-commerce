import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
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

import { PrimaryButton } from "../../components/Elements";
import { ProductCard } from "../../components/ProductCard";
import { DialogueModal } from "../../components/Modals";
import { createPortal } from "react-dom";

const Cart = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const activeDialogueId = useRef('');

  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [dialogueIsActive, setDialogueIsActive] = useState(false);

  const handleSelectItem = (productId) => {
    const isExisting = selectedItems.findIndex((item) => item === productId);

    if (isExisting !== -1) {
      setSelectedItems(selectedItems.filter((item) => item !== productId));
      return;
    }

    setSelectedItems((prevState) => [...prevState, productId]);
  };

  const handleUpdateQuantity = (index, product) => {
    setCart(cart.map((item, cartIndex) => {
      if (index === cartIndex) {
        return product;
      }

      return item;
    }));
  };

  /**
   * Opens the dialogue modal then sets the activeDialogueId.
   */
  const handleOpenDialogue = (productId) => {
    activeDialogueId.current = productId;
    setDialogueIsActive(prevState => !prevState);
  };

  /**
   * Remove item from the cart of the current user. Then reload the current page.
   */
  const handleRemoveItem = async () => {
    handleOpenDialogue(activeDialogueId.current);
    const newCart = cart.filter((item) => item.product_id !== activeDialogueId.current);
    const newSelectedItems = selectedItems.filter((item) => item !== activeDialogueId.current);

    sessionStorage.setItem('selected_items', JSON.stringify(newSelectedItems));

    setCart(newCart);
    setSelectedItems(newSelectedItems);


    // const itemRef = doc(db, 'users', user.uid);
    // const itemSnap = doc(itemRef, 'items', cart[activeDialogueId.current].product_id);
    // await deleteDoc(itemSnap);

    location.reload();
  };

  /**
   * Get all product IDs and update the is_paid status to true.
   */
  const handleCheckout = () => {
    // const productIds = selectedItems.map((index) => cart[index].product_id);
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

      for (const value of temp) {
        const docRef = doc(db, 'products', value.product_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const index = temp.findIndex((item) => item.product_id === value.product_id);
          temp[index].product_details = docSnap.data();
        }
      }

      setCart(temp);
    }

    getItems();
  }, []);

  useEffect(() => {
    const selectedItemsSession = sessionStorage.getItem('selected_items');

    if (selectedItemsSession) {
      setSelectedItems(JSON.parse(selectedItemsSession));
    }
  }, [cart]);

  useEffect(() => {
    if (selectedItems.length && cart.length) {
      sessionStorage.setItem('selected_items', JSON.stringify(selectedItems));

      const total = selectedItems.reduce((accumulator, currValue) => {
        const index = cart.findIndex((item) => item.product_id === currValue);

        if (index !== -1) {
          return accumulator + cart[index].total_price;
        }
      }, 0);

      setTotal(total);
    } else {
      setTotal(0);
    }
  }, [selectedItems]);

  useEffect(() => {
    if (dialogueIsActive) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [dialogueIsActive]);

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
    <>
      <div className="w-full h-full flex flex-col xl:flex-row gap-4 px-12">
        <div className="w-full xl:w-3/4 h-full flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {
              cart.length && (
                cart.map((item, index) => {
                  return <ProductCard key={index} user={user.uid} item={item} handleSelectItem={handleSelectItem} handleUpdateQuantity={handleUpdateQuantity} handleOpenDialogue={handleOpenDialogue} selectedItems={selectedItems} />
                })
              )
            }
          </div>
        </div>
        <div className="p-2 flex flex-col gap-4 place-self-end w-2/4 xl:place-self-auto xl:w-1/4 h-full bg-white border-2 border-black drop-shadow-primary border-green-600">
          <div>
            <p className="font-bold text-lg">Order Summary</p>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <p className="font-bold">Total:</p>
              <p>₱ {total}</p>
            </div>
          </div>
          <button onClick={handleCheckout} className="w-full border-2 border-black px-4 py-2 bg-white disabled:bg-slate-400" disabled={selectedItems.length ? false : true}>Checkout</button>
        </div>
      </div>

      {
        dialogueIsActive &&
        createPortal(
          <DialogueModal setIsActive={handleOpenDialogue} handleRemoveItem={handleRemoveItem} />,
          document.body
        )
      }
    </>
  )
};

export default Cart;
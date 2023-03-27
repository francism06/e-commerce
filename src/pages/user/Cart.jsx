import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  collection,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { PrimaryButton } from "../../components/Elements";
import { ProductCard } from "../../components/ProductCard";
import { DialogueModal } from "../../components/Modals";
import { createPortal } from "react-dom";

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

const Cart = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const activeDialogueId = useRef('');
  const isMounted = useRef(false);

  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [dialogueIsActive, setDialogueIsActive] = useState(false);
  const [paymentType, setPaymentType] = useState('');

  const handleSelectItem = (productId) => {
    const isExisting = selectedItems.findIndex((item) => item === productId);

    if (isExisting !== -1) {
      setSelectedItems(selectedItems.filter((item) => item !== productId));
      return;
    }

    setSelectedItems((prevState) => [...prevState, productId]);
  };

  const handleUpdateQuantity = (productId, product) => {
    setCart(cart.map((item) => {
      if (item.docRef === productId) {
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
    const newCart = cart.filter((item) => item.docRef !== activeDialogueId.current);
    const newSelectedItems = selectedItems.filter((item) => item !== activeDialogueId.current);

    sessionStorage.setItem('selected_items', JSON.stringify(newSelectedItems));

    const userRef = doc(db, 'users', user.uid);
    const itemRef = doc(userRef, 'items', activeDialogueId.current);
    await deleteDoc(itemRef);

    setCart(newCart);
    setSelectedItems(newSelectedItems);

    location.reload();
  };

  /**
   * Get all product IDs and update the is_paid status to true.
   */
  const handleCheckout = async () => {
    const userRef = doc(db, 'users', user.uid);
    const successfulTransactions = [];

    if (!selectedItems.length && paymentType === '') {
      location.reload();
      return;
    }

    /**
     * Perform a query to the products in order to get the latest quantity.
     * If the selected quantity is less than the latest product quantity,
     * it will update both and the transaction will succeed.
     */
    for await (const id of selectedItems) {
      const cartItem = cart.find((item) => item.docRef === id);

      if (cartItem === undefined) {
        continue;
      }

      const producRef = doc(db, 'products', cartItem.product_id);
      const productSnap = await getDoc(producRef);

      if (productSnap.exists()) {
        if (cartItem.quantity <= productSnap.data().quantity) {
          const itemRef = doc(userRef, 'items', id);
          await updateDoc(itemRef, {
            date_paid: serverTimestamp(),
            delivery_status: 'order_placed',
            payment_method: PAYMENT_METHOD[paymentType].method,
            status: [
              {
                status: 'order_placed',
                name: 'Order Placed',
                description: 'Order has been placed.',
                date_created: Timestamp.now()
              }
            ]
          });

          await updateDoc(producRef, {
            quantity: parseInt(productSnap.data().quantity) - parseInt(cartItem.quantity),
          });

          successfulTransactions.push(id);
        }
      }
    }

    const newCart = selectedItems.map((id) => {
      const item = cart.find((item) => item.docRef !== id);
      return item ? item : null;
    });

    if (newCart[0] === null) {
      setCart([]);
    } else {
      setCart(newCart);
    }
    setTotal(0);
    setSelectedItems([]);

    sessionStorage.removeItem('selected_items');
    location.reload();
  };

  const handleSelectPayment = (index) => {
    if (index === paymentType) {
      setPaymentType('');
      return;
    }

    setPaymentType(index);
  };

  /**
   * Initializes the cart state.
   */
  useEffect(() => {
    if (user === null) {
      navigate('/');
    }

    const getItems = async () => {
      const itemRef = doc(db, 'users', user.uid);
      const itemQuery = query(collection(itemRef, 'items'), where('delivery_status', '==', null));
      const itemSnap = await getDocs(itemQuery);

      const temp = [];

      itemSnap.forEach((item) => {
        temp.push({ docRef: item.id, ...item.data() });
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

  /**
   * If cart is initialized, set the selectedItem state based on the session.
   */
  useEffect(() => {
    const selectedItemsSession = sessionStorage.getItem('selected_items');

    if (selectedItemsSession) {
      setSelectedItems(JSON.parse(selectedItemsSession));
    }

    if (cart.length) {
      isMounted.current = true;
    }
  }, [cart]);

  /**
   * Change the total price when updating the selected items.
   */
  useEffect(() => {
    if (!isMounted.current) {
      return;
    }

    if (selectedItems.length && cart.length) {
      sessionStorage.setItem('selected_items', JSON.stringify(selectedItems));

      const total = selectedItems.reduce((accumulator, currValue) => {
        const index = cart.findIndex((item) => item.docRef === currValue);

        if (index !== -1) {
          return accumulator + cart[index].total_price;
        }
      }, 0);

      setTotal(total);
    } else {
      sessionStorage.removeItem('selected_items');
      setTotal(0);
    }
  }, [selectedItems]);

  /**
   * If dialogue is active, remove the ability to scroll in the body.
   */
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
        <div className="flex flex-col gap-4 place-self-end w-2/4 xl:place-self-auto xl:w-1/4 h-full">
          <div className="p-2 flex flex-col gap-4 place-self-end w-full h-full bg-white border-2 border-black drop-shadow-primary">
            <div>
              <p className="font-bold text-lg">Order Summary</p>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row justify-between">
                <p className="font-bold">Total:</p>
                <p>₱ {total}</p>
              </div>
            </div>
          </div>
          <div className="p-2 flex flex-col gap-4 place-self-end w-full h-full bg-white border-2 border-black drop-shadow-primary">
            <div>
              <p className="font-bold text-lg">Payment Method</p>
            </div>
            <div className="flex flex-col gap-2">
              {
                PAYMENT_METHOD.map((payment, index) => {
                  return (
                    <button key={index} className={`${parseInt(paymentType) === index ? 'bg-tertiary' : 'bg-white'} border-2 border-black p-2`} onClick={() => handleSelectPayment(index)} value={payment.method} name="payment_method">{payment.label}</button>
                  );
                })
              }
            </div>
          </div>
          <button onClick={handleCheckout} className="w-full border-2 border-black px-4 py-2 bg-white disabled:bg-slate-400" disabled={selectedItems.length && paymentType !== '' ? false : true}>Checkout</button>
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
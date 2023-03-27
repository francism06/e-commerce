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
import { DialogueModal, ErrorModal } from "../../components/Modals";
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
  const [errorIsActive, setErrorIsActive] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLoading = () => {
    setIsLoading((prevState) => !prevState);
    setTimeout(() => handleErrorModal(), 5000);
  };

  /**
   * Opens the dialogue modal then sets the activeDialogueId.
   */
  const handleOpenDialogue = (productId) => {
    activeDialogueId.current = productId;
    setDialogueIsActive(prevState => !prevState);
  };

  const handleErrorModal = () => {
    setIsLoading(false);
    setErrorIsActive((prevState) => !prevState);
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

    if (paymentType === 1) {
      handleLoading();
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

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isLoading]);

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

      {
        isLoading &&
        createPortal(
          <div className='absolute flex justify-center items-center top-0 left-0 z-30 w-screen h-screen bg-slate-500/50'>
            <svg className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>,
          document.body
        )
      }

      {
        errorIsActive &&
        createPortal(
          <ErrorModal setIsActive={handleErrorModal} />,
          document.body
        )
      }
    </>
  )
};

export default Cart;
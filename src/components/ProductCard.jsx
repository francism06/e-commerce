import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import {
    doc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
    setDoc
} from "firebase/firestore";

export const ProductCard = ({ index, user, item, handleSelectItem }) => {
    const uid = user;
    const [cartDetails, setCartDetails] = useState({});
    const [productDetails, setProductDetails] = useState({});
    const [quantity, setQuantity] = useState(0);
    const isMounted = useRef(false);

    const handleAdd = () => {
        setQuantity((prevState) => prevState += 1);
    };

    const handleMinus = () => {
        setQuantity((prevState) => prevState -= 1);
    };

    const handleChange = (event) => {
        const regex = /^\d+$/;

        if (!event.target.value.match(regex)) {
            return;
        }

        if (parseInt(event.target.value) <= 0) {
            setQuantity(1);
            return;
        }

        if (parseInt(event.target.value) > parseInt(productDetails.quantity)) {
            setQuantity(productDetails.quantity);
            return;
        }

        setQuantity(event.target.value);
    };

    useEffect(() => {
        if (!isMounted.current) {
            return;
        }

        if (quantity !== cartDetails.quantity) {
            const updateQuantity = async () => {
                const itemRef = doc(db, 'users', uid);
                await updateDoc(doc(itemRef, 'items', cartDetails.product_id), {
                    quantity: quantity,
                    total_price: quantity * parseInt(cartDetails.price)
                });

                setCartDetails((prevState) => {
                    return {
                        ...prevState,
                        total_price: quantity * parseInt(cartDetails.price) 
                    };
                })
            };

            updateQuantity();
        }
    }, [quantity]);

    useEffect(() => {
        if (Object.keys(item).length) {
            setCartDetails(item);
        }
    }, [item]);

    useEffect(() => {
        if (isMounted.current) {
            return;
        }

        if (Object.keys(cartDetails).length) {
            const getProductDetails = async () => {
                const docRef = doc(db, 'products', item.product_id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProductDetails(docSnap.data());
                    setQuantity(item.quantity);
                }
            };

            getProductDetails();
            isMounted.current = true;
        }
    }, [cartDetails]);

    return (
        <div className='p-2 flex flex-row gap-2 w-full h-full bg-white border-2 border-black drop-shadow-primary'>
            <div>
                <label className="h-full flex items-center" htmlFor="select-product">
                    <input onChange={handleSelectItem} type="checkbox" name="select-product" id="select-product" className="py-auto" />
                </label>
            </div>
            <div className="w-full flex flex-row items-center gap-3">
                {
                    productDetails.images && (
                        <div className="w-24 h-24 overflow-hidden">
                            <img className="w-24 h-24 object-contain" src={productDetails.images[0].url} />
                        </div>
                    )
                }
                <div className="h-full flex flex-1 flex-col justify-center gap-2 font-bold">
                    <p>{productDetails.name}</p>
                    {/* <p className="text-xs text-slate-500">{productDetails.description}</p> */}
                </div>
                <div className="w-16 flex justify-center items-center">
                    <p>₱ {productDetails.price}</p>
                </div>
                <div className="flex h-full items-center">
                    <div className="h-fit flex flex-row bg-white">
                        <button onClick={handleMinus} className="border-y-2 border-l-2 border-black px-4 py-2 disabled:bg-slate-400 active:bg-secondary" disabled={quantity <= 1}>-</button>
                        <input onChange={handleChange} className="border-2 text-center w-12 border-black px-2 py-2 flex focus:outline-none" type="text" id="quantity" name="quantity" value={quantity} />
                        <button onClick={handleAdd} className="border-y-2 border-r-2 border-black px-4 py-2 disabled:bg-slate-400 active:bg-secondary" disabled={quantity >= productDetails.quantity} >+</button>
                    </div>
                </div>
                <div className="w-16 flex justify-center items-center">
                    <p>₱ {cartDetails.total_price}</p>
                </div>
            </div>
        </div>
    )
}

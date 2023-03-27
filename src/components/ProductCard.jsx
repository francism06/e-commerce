import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import {
    doc,
    updateDoc,
} from "firebase/firestore";
import { Icon } from "@iconify/react";

export const ProductCard = ({ user, item, handleSelectItem, handleUpdateQuantity, handleOpenDialogue, selectedItems }) => {
    const uid = user;

    const [productDetails, setProductDetails] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [isSelected, setIsSelected] = useState(false);
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

        if (parseInt(event.target.value) > parseInt(productDetails.product_details.quantity)) {
            setQuantity(productDetails.product_details.quantity);
            return;
        }

        setQuantity(event.target.value);
    };

    const handleSelect = () => {
        handleSelectItem(productDetails.docRef);
        setIsSelected((prevState) => !prevState);
    };

    useEffect(() => {
        if (Object.keys(item).length) {
            setProductDetails(item);
        }
    }, [item]);

    useEffect(() => {
        if (isMounted.current) {
            handleUpdateQuantity(productDetails.docRef, productDetails);
            return;
        }

        if (Object.keys(productDetails).length && !isMounted.current) {
            const isSelected = selectedItems.findIndex((item) => item === productDetails.docRef);

            if (isSelected !== -1) {
                setIsSelected(true);
            }

            setQuantity(productDetails.quantity);
            isMounted.current = true;
        }
    }, [productDetails]);

    useEffect(() => {
        if (!isMounted.current) {
            return;
        }

        if (Object.keys(productDetails).length) {
            if (quantity !== productDetails.quantity) {
                const updateQuantity = async () => {
                    const itemRef = doc(db, 'users', uid);
                    await updateDoc(doc(itemRef, 'items', productDetails.docRef), {
                        quantity: quantity,
                        total_price: quantity * parseInt(productDetails.price)
                    });

                    setProductDetails((prevState) => {
                        return {
                            ...prevState,
                            quantity: quantity,
                            total_price: quantity * parseInt(productDetails.price)
                        };
                    })
                };

                updateQuantity();
            }
        }
    }, [quantity]);

    useEffect(() => {
        if (selectedItems.length) {
            const isSelected = selectedItems.findIndex((item) => item === productDetails.docRef);

            if (isSelected !== -1) {
                setIsSelected(true);
                return;
            }
        }

        setIsSelected(false);
    }, [selectedItems]);

    useEffect(() => {
        console.log('Product Card', productDetails);
    }, [productDetails]);

    if (!Object.keys(productDetails).length) {
        return (
            <div className='flex flex-col p-8 gap-2 w-full h-36 bg-slate-100 animate-pulse'>
                <div className="w-full h-8 bg-slate-300"></div>
                <div className="w-full h-8 bg-slate-300"></div>
                <div className="w-full h-8 bg-slate-300"></div>
            </div>
        )
    }

    return (
        <div className='p-2 flex flex-row gap-2 w-full h-full bg-white border-2 border-black drop-shadow-primary'>
            <div>
                <div className="h-full flex justify-center">
                    <input checked={isSelected} onChange={handleSelect} type="checkbox" name="select-product" id="select-product" className="flex h-full" />
                </div>
            </div>
            <div className="w-full flex flex-row items-center gap-3">
                {
                    productDetails.product_details?.images && (
                        <div className="w-24 h-24 overflow-hidden">
                            <img className="w-24 h-24 object-contain" src={productDetails.product_details.images.length ? productDetails.product_details.images[0].url : '/Logo.png'} />
                        </div>
                    )
                }
                <div className="h-full flex flex-1 flex-col justify-center gap-2 font-bold">
                    <p>{productDetails.product_details.name}</p>
                    <p className="text-xs font-light text-slate-500">{productDetails.product_details.description}</p>
                </div>
                <div className="w-20 flex justify-center items-center">
                    <p>₱ {productDetails.product_details.price}</p>
                </div>
                <div className="flex h-full items-center">
                    <div className="h-fit flex flex-row bg-white">
                        <button onClick={handleMinus} className="border-y-2 border-l-2 border-black px-4 py-2 disabled:bg-slate-400 active:bg-secondary" disabled={quantity <= 1}>-</button>
                        <input onChange={handleChange} className="border-2 text-center w-12 border-black px-2 py-2 flex focus:outline-none" type="text" id="quantity" name="quantity" value={quantity} />
                        <button onClick={handleAdd} className="border-y-2 border-r-2 border-black px-4 py-2 disabled:bg-slate-400 active:bg-secondary" disabled={quantity >= productDetails.product_details.quantity} >+</button>
                    </div>
                </div>
                <div className="w-20 flex justify-center items-center">
                    <p>₱ {productDetails.total_price}</p>
                </div>
                <div className="w-20 flex justify-center items-center">
                    <button onClick={() => handleOpenDialogue(productDetails.docRef)} className="text-red-500 active:text-red-900 text-xl">
                        <Icon className="hover:scale-110 transition-all" icon="clarity:trash-solid" />
                    </button>
                </div>
            </div>
        </div>
    )
}

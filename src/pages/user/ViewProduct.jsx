import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import {
    doc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
    setDoc,
    addDoc,
    query,
    where
} from "firebase/firestore";

import { Slider } from "../../components/Slider";

const ViewProduct = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { id } = useParams();
    const navigate = useNavigate();

    const [productDetails, setProductDetails] = useState({});
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = async () => {
        if (user === null) {
            navigate('/login');
            location.reload();
        }

        if (productDetails.quantity === 0) {
            return;
        }

        const details = {
            'product_id': id,
            'quantity': quantity,
            'price': parseInt(productDetails.price),
            'delivery_status': null,
            'total_price': parseInt(quantity) * parseInt(productDetails.price),
            'is_paid': false,
            'date_created': Date.now()
        };

        const itemRef = doc(db, 'users', user.uid);
        const q = query(collection(itemRef, 'items'), where('product_id', '==', id), where('delivery_status', 'not-in', ['order_placed', 'order_packed', 'order_shipped', 'order_delivered']));

        const temp = [];

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const newQuantity = parseInt(doc.data().quantity) + parseInt(quantity);
            temp.push({
                docId: doc.id,
                refId: id,
                quantity: newQuantity,
                total_price: parseInt(newQuantity) * parseInt(productDetails.price)
            });
        });

        if (Object.keys(temp).length !== 0) {
            for await (const item of temp) {
                await updateDoc(doc(itemRef, 'items', item.docId), { quantity: item.quantity, total_price: item.total_price });
            }
        } else {
            await addDoc(collection(itemRef, 'items'), details);
        }

        location.reload();
    };

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
        if (!id) {
            navigate('../products');
        }

        const getProductDetails = async () => {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                navigate('../products');
            }

            setProductDetails(docSnap.data());
        };

        getProductDetails();
    }, []);

    return (
        <div className="w-full h-full flex flex-row gap-8 px-8 2xl:px-24">
            <div className="flex flex-col gap-4 w-2/4 xl:w-2/5 h-full">
                <Slider content={productDetails.images} />
            </div>
            <div className="flex flex-col gap-8 w-2/4 xl:w-3/5 h-full">
                <div>
                    <p className="font-archivo text-2xl font-bold">{productDetails.name}</p>
                </div>
                <div>
                    {
                        (productDetails.description !== undefined && productDetails.description !== '') ? (
                            <p className="text-slate-600">{productDetails.description}</p>
                        ) : (
                            <p className="text-slate-600">No description.</p>
                        )
                    }
                </div>
                <div>
                    <button className="cursor-default text-xl w-fit px-8 py-2 rounded-full bg-white border-2 border-black
                    transition hover:-translate-x-1 hover:-translate-y-1 hover:drop-shadow-primary">₱ {productDetails.price}</button>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                    <div className="flex flex-row bg-white">
                        <button onClick={handleMinus} className="border-y-2 border-l-2 border-black px-4 py-2 disabled:bg-slate-400 active:bg-secondary" disabled={quantity <= 1}>-</button>
                        <input onChange={handleChange} className="border-2 border-black px-4 py-2 flex focus:outline-none" type="text" id="quantity" name="quantity" value={quantity} />
                        <button onClick={handleAdd} className="border-y-2 border-r-2 border-black px-4 py-2 disabled:bg-slate-400 active:bg-secondary" disabled={quantity >= productDetails.quantity} >+</button>
                    </div>
                    {
                        productDetails.quantity === 0 ? (
                            <div>
                                <p className="text-red-500">Out of Stock!</p>
                            </div>
                        ) : ((productDetails.quantity <= 100) && (
                            <div>
                                <p className="text-slate-500">Only {productDetails.quantity} item/s remaining.</p>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <button onClick={handleAddToCart} className="w-fit px-8 py-1 bg-secondary border-2 border-black text-white font-bold  drop-shadow-primary 
                transition hover:translate-x-1 hover:translate-y-1 hover:drop-shadow-none active:bg-secondary-active disabled:bg-slate-500" type="button" disabled={productDetails.quantity === 0 ? true : false} >Add to Cart</button>
                </div>
            </div>
        </div>
    )
};

export default ViewProduct;
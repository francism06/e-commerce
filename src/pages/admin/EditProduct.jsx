import React, { useState, useEffect } from "react";
import { db, storage } from "../../config/firebase";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

/**
 * Product Details
 * 
 * name
 * description
 * image
 * category
 * price
 * quantity
 */

const EditProduct = () => {
    const details = {
        'name': '',
        'description': '',
        'images': [],
        'price': 0,
        'quantity': 0
    };

    const [productDetails, setProductDetails] = useState(details);
    const [imagesSelected, setImagesSelected] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        // Uploads to collection
        const docRef = doc(db, 'products', id);
        const imageList = new Array();

        // Uploads images to storage
        if (imagesSelected.length) {
            for await (const image of imagesSelected) {
                const productRef = ref(storage, `products/${id}/${image.name}`);
                imageList.push(
                    await uploadBytes(ref(storage, productRef), image.file)
                        .then(async (snapshot) => {
                            return {
                                url: await getDownloadURL(snapshot.ref),
                                name: image.name
                            }
                        }));
            }
        }

        imageList.push(...productDetails.images);

        // Updates collection
        setProductDetails((prevState) => {
            return {
                ...prevState,
                'images': imageList
            }
        });

        await updateDoc(docRef, {
            ...productDetails,
            images: imageList
        });

        navigate('../products');
    };

    const handleChange = (event) => {
        setProductDetails((prevState) => {
            return {
                ...prevState,
                [event.target.id]: event.target.value
            };
        });
    };

    const handleUploadImage = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const imageURL = URL.createObjectURL(event.target.files[0]);
            setImagesSelected((prevState) => {
                return [...prevState, { file: event.target.files[0], display: imageURL, name: event.target.files[0].name }];
            });
        }
    };

    const handleRemoveImage = async (index) => {
        setImagesSelected((prevState) => {
            return prevState.filter((_, key) => key !== index)
        });
    };

    const handleRemoveUploadedImage = async (index) => {
        setProductDetails((prevState) => {
            return {
                ...prevState,
                'images': prevState.images.filter((_, key) => key !== index)
            }
        });
    };

    useEffect(() => {
        if (!id) {
            navigate('../products');
        }

        const getProducts = async () => {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                navigate('../products');
            }

            setProductDetails(docSnap.data());
        };

        getProducts();
    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4">
            <div className="flex flex-row justify-between items-center">
                <p className="font-bold text-secondary">Products</p>
                <div className="flex flex-row gap-2">
                    <Link to={'../products'} className="px-4 py-2 flex justify-center items-center border-2 border-secondary text-secondary rounded-md">Cancel</Link>
                    <button onClick={handleSubmit} type="button" className="px-4 py-2 flex justify-center items-center bg-secondary text-white rounded-md">Save</button>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <p>Name</p>
                    <input onChange={handleChange} value={productDetails.name} placeholder="Enter product name here..." className="border-2 border-black px-2 py-1" type="text" name="name" id="name" />
                </div>
                <div className="flex flex-col">
                    <p>Description</p>
                    <textarea onChange={handleChange} value={productDetails.description} placeholder="Enter description here..." className="border-2 border-black px-2 py-1 resize-none" name="description" id="description" cols="30" rows="10"></textarea>
                </div>
                <div className="flex flex-col">
                    <p>Image</p>
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {
                            productDetails.images.length ? (
                                productDetails.images.map((image, index) => {
                                    return (
                                        <button onClick={() => handleRemoveUploadedImage(index)} className="flex justify-center items-center relative w-full h-72 overflow-hidden border border-gray-500 rounded-md cursor-pointer" key={index}>
                                            <div className="opacity-0 hover:opacity-100 flex justify-center items-center absolute w-full h-full bg-slate-800/30 transition-all">
                                                <p className="w-fit p-2 bg-red-600 text-white z-[1] rounded-md">Remove</p>
                                            </div>
                                            <img src={image.url} className="object-contain w-full h-72" />
                                        </button>
                                    )
                                })
                            ) : null
                        }
                        {
                            imagesSelected.length ? (
                                imagesSelected.map((image, index) => {
                                    return (
                                        <button onClick={() => handleRemoveImage(index)} className="flex justify-center items-center relative w-full h-72 overflow-hidden border border-gray-500 rounded-md cursor-pointer" key={index}>
                                            <div className="opacity-0 hover:opacity-100 flex justify-center items-center absolute w-full h-full bg-slate-800/30 transition-all">
                                                <p className="w-fit p-2 bg-red-600 text-white z-[1] rounded-md">Remove</p>
                                            </div>
                                            <img src={image.display} className="object-contain w-full h-72" />
                                        </button>
                                    )
                                })
                            ) : null
                        }
                        <label htmlFor="image" className="flex justify-center items-center w-full h-72 cursor-pointer border border-gray-500 rounded-md">Upload Image</label>
                    </div>
                    <input hidden={true} onChange={handleUploadImage} accept="image/" className="border-2 border-black px-2 py-1" type="file" name="image" id="image" />
                </div>
                <div className="flex flex-col">
                    <p>Price</p>
                    <input onChange={handleChange} placeholder="Enter price here..." value={productDetails.price} className="border-2 border-black px-2 py-1" type="text" name="price" id="price" />
                </div>
                <div className="flex flex-col">
                    <p>Quantity</p>
                    <input onChange={handleChange} placeholder="Enter quantity here..." value={productDetails.quantity} className="border-2 border-black px-2 py-1" type="text" name="quantity" id="quantity" />
                </div>
            </div>
        </div>
    )
};

export default EditProduct;
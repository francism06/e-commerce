import React, { useState, useEffect } from "react";
import { db, storage } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

/**
 * Service Details
 * 
 * name
 * description
 * image
 * price_start
 * price_end - nullable
 * tags
 * note
 */

const CreateService = () => {
    const details = {
        'name': '',
        'description': '',
        'images': [],
        'price_start': 0,
        'price_end': 0,
        'tag': '',
        'note': ''
    };

    const [serviceDetails, setServiceDetails] = useState(details);
    const [imagesSelected, setImagesSelected] = useState([]);
    const navigate = useNavigate()

    const handleSubmit = async () => {
        // Uploads to collection
        const docRef = await addDoc(collection(db, 'services'), { ...serviceDetails, 'date_created': serverTimestamp() }).then((docRef) => docRef.id);
        const imageList = new Array();

        // Uploads images to storage
        if (imagesSelected.length) {
            for await (const image of imagesSelected) {
                const serviceRef = ref(storage, `services/${docRef}/${image.name}`);
                imageList.push(
                    await uploadBytes(ref(storage, serviceRef), image.file)
                        .then(async (snapshot) => {
                            return {
                                url: await getDownloadURL(snapshot.ref),
                                name: image.name
                            }
                        }));
            }
        }

        setServiceDetails((prevState) => {
            return {
                ...prevState,
                'images': imageList
            }
        });

        // Updates collection
        await updateDoc(doc(db, 'services', docRef), {
            images: imageList
        });

        navigate('../services');
    };

    const handleChange = (event) => {
        setServiceDetails((prevState) => {
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

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4">
            <div className="flex flex-row justify-between items-center">
                <p className="font-bold text-secondary">Services</p>
                <div className="flex flex-row gap-2">
                    <Link to={'../services'} className="px-4 py-2 flex justify-center items-center drop-shadow-sm border border-secondary text-secondary ">Cancel</Link>
                    <button onClick={handleSubmit} type="button" className="px-4 py-2 flex justify-center items-center bg-secondary text-white ">Save</button>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <p>Name</p>
                    <input onChange={handleChange} value={serviceDetails.name} placeholder="Enter service name here..." className="drop-shadow-sm border border-slate-200 px-2 py-1" type="text" name="name" id="name" />
                </div>
                <div className="flex flex-col">
                    <p>Description</p>
                    <textarea onChange={handleChange} value={serviceDetails.description} placeholder="Enter description here..." className="drop-shadow-sm border border-slate-200 px-2 py-1 resize-none" name="description" id="description" cols="30" rows="10"></textarea>
                </div>
                <div className="flex flex-col">
                    <p>Image</p>
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {
                            imagesSelected.map((image, index) => {
                                return (
                                    <button onClick={() => handleRemoveImage(index)} className="flex justify-center items-center relative w-full h-72 overflow-hidden border border-gray-500  cursor-pointer" key={index}>
                                        <div className="opacity-0 hover:opacity-100 flex justify-center items-center absolute w-full h-full bg-slate-800/30 transition-all">
                                            <p className="w-fit p-2 bg-red-600 text-white z-[1] ">Remove</p>
                                        </div>
                                        <img src={image.display} className="object-contain w-full h-72" />
                                    </button>
                                )
                            })
                        }
                        <label htmlFor="image" className="flex justify-center items-center w-full h-72 cursor-pointer border border-gray-500 ">Upload Image</label>
                    </div>
                    <input hidden={true} onChange={handleUploadImage} accept="image/" className="drop-shadow-sm border border-slate-200 px-2 py-1" type="file" name="image" id="image" />
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col">
                        <p>Price Start</p>
                        <input onChange={handleChange} placeholder="Enter price here..." value={serviceDetails.price_start} className="drop-shadow-sm border border-slate-200 px-2 py-1" type="text" name="price_start" id="price_start" />
                    </div>
                    <div className="flex flex-col">
                        <p>Price End</p>
                        <input onChange={handleChange} placeholder="Enter price here..." value={serviceDetails.price_end} className="drop-shadow-sm border border-slate-200 px-2 py-1" type="text" name="price_end" id="price_end" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <p>Note <span className="text-slate-500">(e.g. per tooth, per arch, per quadrant)</span></p>
                    <input onChange={handleChange} placeholder="Enter note here..." value={serviceDetails.note} className="drop-shadow-sm border border-slate-200 px-2 py-1 w-2/4" type="text" name="note" id="note" />
                </div>
                <div className="flex flex-col">
                    <p>Tag <span className="text-slate-500">(e.g. Diagnostics, Surgery)</span></p>
                    <input onChange={handleChange} placeholder="Enter tag here..." value={serviceDetails.tag} className="drop-shadow-sm border border-slate-200 px-2 py-1 w-2/4" type="text" name="tag" id="tag" />
                </div>
            </div>
        </div>
    )
};

export default CreateService;
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';
import {
    collection,
    getDocs
} from 'firebase/firestore';

const Services = () => {
    const [serviceList, setServiceList] = useState([]);
    const [activeServiceIndex, setActiveServiceIndex] = useState(0);

    useEffect(() => {
        const getServices = async () => {
            const docRef = collection(db, 'services');
            const docSnap = await getDocs(docRef);

            const temp = new Array();

            docSnap.forEach((doc) => {
                temp.push({ docId: doc.id, ...doc.data() });
            });

            setServiceList(temp);
        };

        getServices();
    }, []);

    if (!serviceList.length) {
        return (
            <div className="px-8">
                <div className='flex flex-col p-8 gap-2 w-full h-36 bg-slate-100 animate-pulse'>
                    <div className="w-full h-8 bg-slate-300"></div>
                    <div className="w-full h-8 bg-slate-300"></div>
                    <div className="w-full h-8 bg-slate-300"></div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className='flex justify-center items-center p-8 lg:px-24'>
                <div className='flex flex-col lg:flex-row w-full h-full border-2 border-black bg-white drop-shadow-primary-xl rounded-lg overflow-hidden'>
                    <div className='w-full h-[30vh] lg:w-2/5 lg:h-[80vh] flex flex-col  bg-indigo-500 border-b-2 lg:border-r-2 lg:border-b-0 border-black overflow-auto'>
                        {
                            serviceList.map((content, index) => {
                                return (
                                    <button className={`${index === activeServiceIndex ? 'bg-yellow-400 text-black font-bold' : ''} w-full p-2 text-white`} onClick={() => setActiveServiceIndex(index)} key={index}>
                                        <p>{content.name}</p>
                                    </button>
                                )
                            })
                        }
                    </div>
                    <div className='w-full h-[80vh] bg-white overflow-auto'>
                        <div className='h-2/4'>
                            <img className='h-full w-full object-cover border-b-2 border-black' src={serviceList[activeServiceIndex].images[0].url} />
                        </div>
                        <div className='p-8 w-full h-2/4 flex flex-col gap-4 relative'>
                            <div className='flex flex-col lg:flex-row gap-4 lg:items-center'>
                                <p className='text-xl font-bold'>{serviceList[activeServiceIndex].name}</p>
                                <div className='flex flex-row gap-1 items-center'>
                                    <p>₱ {serviceList[activeServiceIndex].price_start}</p>
                                    {
                                        serviceList[activeServiceIndex].price_end !== 0 && (
                                            <>
                                                <p>-</p>
                                                <p>₱ {serviceList[activeServiceIndex].price_end}</p>
                                            </>
                                        )
                                    }
                                    {
                                        serviceList[activeServiceIndex].note !== '' && (
                                            <p className='text-slate-400'>({serviceList[activeServiceIndex].note})</p>
                                        )
                                    }
                                </div>
                            </div>
                            {
                                serviceList[activeServiceIndex].tag !== '' && (
                                    <p className='bg-white px-4 py-1 border-2 border-black w-fit rounded-full drop-shadow-primary'>{serviceList[activeServiceIndex].tag}</p>
                                )
                            }
                            <p>{serviceList[activeServiceIndex].description}</p>
                            <Link className='absolute bottom-8 primary-btn place-self-end mt-auto' to={'contact-us'}>Contact Us!</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Services;
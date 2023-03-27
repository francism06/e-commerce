import React from 'react';
import { Icon } from '@iconify/react';

export const ErrorModal = ({ setIsActive }) => {
    return (
        <div className='absolute flex justify-center items-center top-0 left-0 z-30 w-screen h-screen bg-slate-500/50'>
            <div className='w-1/4 p-4 bg-white border-2 border-black drop-shadow-primary'>
                <div className='flex flex-col justify-center gap-4'>
                    <p className='text-xl'>We're sorry</p>
                    <p className='text-gray-500'>Things don't appear to be working right now. Please use our mobile application if you want to pay using PayPal.</p>
                    <button className='w-full bg-sky-700 py-2 text-white' onClick={setIsActive}>Close</button>
                </div>
            </div>
        </div>
    )
};

export const DialogueModal = ({ setIsActive, handleRemoveItem }) => {
    return (
        <div className='fixed flex justify-center items-center top-0 left-0 z-30 w-screen min-h-screen bg-slate-500/50'>
            <div className='w-3/4 lg:w-2/4 bg-white border-2 border-black drop-shadow-primary'>
                <div className='flex flex-row justify-between bg-black h-8'></div>
                <div className='flex flex-col w-full p-4 gap-4'>
                    <div>
                        <p className='font-lg font-bold'>Remove item?</p>
                    </div>
                    <div>
                        <p>Are you sure you want to remove the item selected?</p>
                    </div>
                    <div className='flex flex-row gap-4 justify-center lg:justify-end'>
                        <button onClick={setIsActive} className='px-4 py-2 bg-white border-2 border-black'>Cancel</button>
                        <button onClick={handleRemoveItem} className='px-4 py-2 bg-red-500 text-white border-2 border-black'>Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )
};
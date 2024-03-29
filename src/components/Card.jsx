import React from 'react'
import { NavLink } from 'react-router-dom'

import { PrimaryButton, SecondaryButton, TertiaryButton } from './Elements'

export const ServiceCard = ({ type = 0 }) => {
    return (
        <div className={`
            ${type ? 'bg-secondary text-white' : 'bg-white text-black'}
            w-full h-full flex flex-col p-8  border-2 border-black drop-shadow-primary gap-8
            `}
        >
            <div className='flex flex-col w-full gap-4'>
                <h1 className='text-xl font-bold'>Card Title</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi perferendis modi possimus impedit, fugit ut? Doloremque quo, doloribus voluptatem provident sint aut, vero totam neque, eaque laborum unde nobis harum.</p>
            </div>
            <div>
                <TertiaryButton label={'Read More'} location={'/services'} CTA={true} />
            </div>
        </div>
    )
}

export const ProductCard = () => {
    return (
        <div className={`
            w-full h-full flex flex-col bg-white border-2 border-black drop-shadow-primary 
        `}>
            <div className='w-full'>
                
            </div>
            <div className='w-full flex flex-col gap-4 p-4'>
                <p className='font-bold'>Product Title</p>
                <div className='w-full h-full flex md:flex-col md:items-start md:gap-2 flex-row items-center justify-between'>
                    <p>Price</p>
                    <SecondaryButton label={'Buy Now'} location={'/products'} />
                </div>
            </div>
        </div>
    )
}
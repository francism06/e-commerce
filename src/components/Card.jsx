import React from 'react'
import { NavLink } from 'react-router-dom'

export const ServiceCard = ({ type }) => {
    return (
        <div className={`
            ${type ? 'bg-secondary text-white' : 'bg-white text-black'}
            w-full h-full flex flex-col p-8 rounded-lg border-2 border-black drop-shadow-primary gap-8
            `}
        >
            <div className='flex flex-col w-full gap-4'>
                <h1 className='text-xl font-bold'>Card Title</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi perferendis modi possimus impedit, fugit ut? Doloremque quo, doloribus voluptatem provident sint aut, vero totam neque, eaque laborum unde nobis harum.</p>
            </div>
            <div>
                <NavLink to="/services" className={`
                    ${type ? 'border-white' : 'border-black'}
                    pb-1 border-b
                    `}
                >Read More &rarr;</NavLink>
            </div>
        </div>
    )
}

export const ProductCard = () => {
    return (
        <div className={`
            w-full h-full flex flex-col bg-white border-2 border-black drop-shadow-primary rounded-lg
        `}>
            <div className='w-full'>
                
            </div>
            <div className='w-full flex flex-col gap-4 p-4'>
                <p className='font-bold'>Product Title</p>
                <div className='w-full h-full flex flex-row items-center justify-between'>
                    <p>Price</p>
                    <button className="px-8 py-1 bg-white border-2 border-black rounded-lg
                    transition hover:-translate-x-1 hover:-translate-y-1 hover:drop-shadow-primary active:bg-secondary-active ">Buy Now</button>
                </div>
            </div>
        </div>
    )
}
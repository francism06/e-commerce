import React from 'react';
import { Icon } from '@iconify/react';
import { NavLink } from "react-router-dom";


export const Header = ({ title }) => {
    return (
        <h1 className="font-bold text-2xl p-4 bg-tertiary border-2 border-black drop-shadow-primary">{title}</h1>
    )
};

export const PrimaryButton = ({ label, location = null, action = null, CTA = false }) => {
    return (
        (
            location ?
                (<NavLink to={location} className={`${CTA && 'flex flex-row items-center gap-2'} w-fit px-8 py-1 bg-secondary border-2 border-black text-white font-bold rounded-lg drop-shadow-primary 
                transition hover:translate-x-1 hover:translate-y-1 hover:drop-shadow-none active:bg-secondary-active`}>{label} {CTA && <Icon icon="ic:outline-arrow-right-alt"/>}</NavLink>)
                :
                (<button className={`${CTA && 'flex flex-row items-center gap-2'} w-fit px-8 py-1 bg-secondary border-2 border-black text-white font-bold rounded-lg drop-shadow-primary 
                transition hover:translate-x-1 hover:translate-y-1 hover:drop-shadow-none active:bg-secondary-active`}>{label} {CTA && <Icon icon="ic:outline-arrow-right-alt"/>}</button>)
        )
    )
};

export const SecondaryButton = ({ label, location = null, action = null, CTA = false }) => {
    return (
        (
            location ?
                (<NavLink to={location} className={`${CTA && 'flex flex-row items-center gap-2'} px-8 py-1 bg-white border-2 border-black rounded-lg 
                transition hover:-translate-x-1 hover:-translate-y-1 hover:drop-shadow-primary active:bg-secondary-active`}>{label} {CTA && <Icon icon="ic:outline-arrow-right-alt"/>}</NavLink>)
                :
                (<button className={`${CTA && 'flex flex-row items-center gap-2'} px-8 py-1 bg-white border-2 border-black rounded-lg 
                transition hover:-translate-x-1 hover:-translate-y-1 hover:drop-shadow-primary active:bg-secondary-active`}>{label} {CTA && <Icon icon="ic:outline-arrow-right-alt"/>}</button>)
        )
    )
};

export const TertiaryButton = ({ label, location = null, action = null, CTA = false }) => {
    return (
        (
            location ?
                (<NavLink to={location} className={`${CTA && 'flex flex-row items-center gap-2'} underline`}>{label} {CTA && <Icon icon="ic:outline-arrow-right-alt"/>}</NavLink>)
                :
                (<button className={`${CTA && 'flex flex-row items-center gap-2'} underline`}>{label} {CTA && <Icon icon="ic:outline-arrow-right-alt"/>}</button>)
        )
    )
};
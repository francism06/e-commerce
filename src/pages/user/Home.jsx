import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { ServiceCard, ProductCard } from "../../components/Card";


function Home() {
  // const [users, setUsers] = React.useState([]);

  // useEffect(() => {}, []);
  return (
    <>
      {/* Hero Section */}
      <div className="flex flex-row w-full px-24 py-12">
        <div className="w-2/4 flex flex-col gap-8 justify-center">
          <h1 className="text-4xl font-bold text-secondary">Because you deserve a beautiful smile.</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime magni repudiandae doloribus aut fugiat impedit ad ea placeat commodi eos.</p>
          <NavLink to={"/services"} className="w-fit px-8 py-1 bg-secondary border-2 border-black text-white font-bold rounded-lg drop-shadow-primary 
          transition hover:translate-x-1 hover:translate-y-1 hover:drop-shadow-none active:bg-secondary-active
          ">Our Services &rarr;</NavLink>
        </div>
        <div className="w-2/4">

        </div>
      </div>

      {/* Services Section */}
      <div className="flex flex-col w-full px-24 py-12 gap-8">
        <div className="w-full flex flex-col gap-4 items-center justify-center">
          <Header title={'Our Services'} />
          {/* <h1 className="text-4xl font-bold text-secondary">Our Services</h1> */}
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime magni repudiandae doloribus aut fugiat impedit ad ea placeat commodi eos.</p>
        </div>
        <div className="w-full grid grid-cols-3 gap-8">
          <ServiceCard type={1} />
          <ServiceCard type={0} />
          <ServiceCard type={0} />
        </div>
      </div>

      {/* Products Section */}
      <div className="flex flex-col w-full px-24 py-12 gap-8">
        <div className="w-full flex flex-col gap-4 items-center justify-center">
          <Header title={'Our Products'} />
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime magni repudiandae doloribus aut fugiat impedit ad ea placeat commodi eos.</p>
        </div>
        <div className="w-full grid grid-cols-5 gap-8">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>

      {/* Download App Section */}
      <div className="flex flex-row mx-44 my-12 border-2 border-black bg-white rounded-lg drop-shadow-primary overflow-hidden">
        <div className="w-2/4 flex flex-col gap-8 p-12 justify-center bg-tertiary border-r-2 border-black">
          <h1 className="text-4xl font-bold text-black">Download our Application</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam eveniet, praesentium, eaque facilis veniam rem beatae minima expedita saepe hic dicta nihil in doloribus assumenda magni sint asperiores! Debitis sit ex accusantium dolorum, at architecto saepe fuga molestias dolore amet delectus veniam ducimus odit ad neque maiores eius minus magni?</p>
          <NavLink to={"/services"} className="w-fit px-8 py-1 bg-secondary border-2 border-black text-white font-bold rounded-lg drop-shadow-primary 
          transition hover:translate-x-1 hover:translate-y-1 hover:drop-shadow-none active:bg-secondary-active
          ">Download Now &rarr;</NavLink>
        </div>
        <div className="w-2/4">

        </div>
      </div>
    </>
  );
}

function Header ({ title }) {
  return (
    <h1 className="font-bold text-2xl p-4 bg-tertiary border-2 border-black drop-shadow-primary">{ title }</h1>
  )
}

export default Home;

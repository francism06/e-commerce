import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  doc,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "firebase/firestore";

import { ServiceCard, ProductCard } from "../../components/Card";
import { Header, PrimaryButton } from "../../components/Elements";

// Teeth Whitening
// Implants
// And more!
const SERVICES = [
  {
    header: 'Say goodbye to your yellow teeth',
    body: "Regrettably, discoloured teeth can age you and make you feel insecure. Here, we provide effective professional tooth whitening services.",
    image: 'Teeth-Whitening.jpg'
  },
  {
    header: 'Save your tooth',
    body: "Root canal therapy is the best course of action for you, we make sure your visit is relaxing and painless. The safest, simplest, and most efficient way to stop decay and infection and prevent extraction of your tooth is with root canal therapy.",
    image: 'Root-Canal.jpeg'
  },
  {
    header: 'And more!',
    body: "We're delighted to serve as your new source for top-notch dentistry. Come see us for a cleaning and comprehensive dental examination. Moreover, all else you require to feel and appear your best.",
    image: 'More-Service.jpg'
  },
];

const PRODUCTS = [
  {
    header: 'Toothbrush',
    image: 'Toothbrush.jpg'
  },
  {
    header: 'Toothpaste',
    image: 'Toothpaste.jpg'
  },
  {
    header: 'Mouthwash',
    image: 'Mouthwash.jpg'
  }
];

const Home = () => {
  const [activeService, setActiveService] = useState(0);

  return (
    <>
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row px-24 gap-8">
        <div className="w-full lg:w-2/4 flex flex-col gap-8 justify-center items-center text-center lg:text-left lg:items-start">
          <div className="flex flex-col justify-center items-center lg:text-left lg:items-start">
            <h1 className="font-paytone text-secondary text-5xl font-black">Because you deserve a beautiful </h1>
            <div className="bg-tertiary w-fit p-2 border-2 border-black rounded-full drop-shadow-primary -rotate-6">
              <div className="border-2 border-black rounded-full px-4 py-2">
                <p className="font-paytone text-black font-black text-3xl">smile.</p>
              </div>
            </div>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto cupiditate nostrum placeat accusamus officia molestias tempora eligendi nihil, minus facere veritatis eaque maxime omnis! Voluptatem nam asperiores accusamus odio dolorum?</p>
          <PrimaryButton label={'Learn More'} location={'/services'} CTA={true} />
        </div>
        <div className="w-full lg:w-2/4 flex justify-center items-center">
          <img className="bg-white object-cover h-[80vh] border-2 border-black drop-shadow-primary-xl" src="Homepage.jpg" alt="Sicat Dental Clinic" />
        </div>
      </div>

      {/* Services Section */}
      <div className="w-full mt-24 h-48 flex flex-col justify-center items-center gap-12">
        <p className="font-paytone text-6xl">Our Services</p>
        <p className="text-xl w-1/2 text-center">Welcome to Sicat Dental Clinic, where we offer high-quality dental care to you and your loved ones.</p>
      </div>

      <div className="w-full mt-24 flex flex-col xl:flex-row bg-white border-2 border-black">
        <div className="w-full h-[80vh] flex justify-center items-center bg-yellow-400">
          <img className="w-3/4 h-3/4 object-cover border-2 border-black drop-shadow-primary-xl transition-all rounded-2xl" src={SERVICES[activeService].image} />
        </div>
        <div className="w-full h-[80vh] bg-black grid grid-rows-3">
          {
            SERVICES.map((service, index) => {
              return (
                <Link to={'services'} onMouseOver={() => setActiveService(index)} className="w-full h-full flex justify-center cursor-pointer items-center hover:bg-yellow-800 transition-all" key={index}>
                  <div className="flex flex-col gap-8 px-24">
                    <p className="font-paytone text-4xl font-bold text-yellow-400">{service.header}</p>
                    <p className="text-white">{service.body}</p>
                  </div>
                </Link>
              )
            })
          }
        </div>
      </div>

      {/* Product Section */}
      <div className="w-full mt-24 h-48 flex flex-col justify-center items-center gap-12">
        <p className="font-paytone text-6xl">Our Products</p>
        <p className="text-xl w-1/2 text-center">We’ll help you fix decay, gum disease, and other issues to create by offering you our trusted products.</p>
      </div>

      <div className="w-full mt-24 flex flex-col justify-center items-center p-24 bg-indigo-500 border-2 border-black">
        <div className="flex flex-col w-full h-full justify-between items-center gap-24">
          <div className="w-full grid grid-rows-3 lg:grid-cols-3 lg:grid-rows-none gap-24">
            {
              PRODUCTS.map((product, index) => {
                return (
                  <div className="flex flex-col justify-center items-center gap-8 relative" key={index}>
                    <div className="w-full h-[32rem] border-2 border-black bg-white drop-shadow-primary-xl overflow-hidden rounded-2xl">
                      <img className="object-cover h-full w-full grayscale hover:scale-110 hover:grayscale-0 transition-all" src={product.image} />
                    </div>
                    <div className="z-[1] absolute bg-tertiary px-8 py-4 text-xl font-bold border-2 border-black drop-shadow-primary rounded-full top-[95%]">
                      <p>{product.header}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="flex">
            <Link className="w-fit px-8 py-4 text-2xl bg-white border-2 border-black text-black font-bold  drop-shadow-primary 
                transition hover:translate-x-1 hover:translate-y-1 hover:drop-shadow-none active:bg-secondary-active" to={'products'}>Shop Now!</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

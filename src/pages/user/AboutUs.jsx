import React from 'react'

import { Header } from '../../components/Elements';

const AboutUs = () => {
  return (
    <div className='flex flex-col gap-12'>
      <div className='w-full flex flex-col-reverse lg:flex-row px-8 gap-8'>
        <div className='w-full lg:w-2/4 h-full'>
          <img className='w-full h-full object-cover border-2 border-black drop-shadow-primary-xl bg-white rounded-lg' src="Sicat-Dental-Clinic.jpg" alt="Sicat Dental Clinic" />
        </div>
        <div className='w-full lg:w-2/4 flex flex-col gap-8 justify-center px-24'>
          <div className='w-fit'>
            <Header title={'About Us'} />
          </div>
          <div className='flex flex-col gap-4'>
            <p>Sicat Dental Clinic, located in Concepcion Tarlac, is a top-notch dental clinic that is owned and operated by the skilled and experienced dentist, Mark Christian Sicat. As a single practitioner, Dr. Sicat is dedicated to providing personalized dental care that meets the unique needs of each patient.</p>
            <p>The clinic is designed to provide a comfortable and relaxing environment for patients of all ages. From the waiting room to the treatment rooms, every detail has been carefully considered to ensure a stress-free and enjoyable dental experience.</p>
            <p>At Sicat Dental Clinic, patients can expect a wide range of dental services, including preventive care, restorative treatments, and cosmetic procedures. Dr. Sicat and his team are committed to using the latest techniques and technology to deliver high-quality dental care that is both effective and affordable.</p>
            <p>Whether you need a routine cleaning or a more complex procedure, Sicat Dental Clinic is the place to go for all your dental needs. With a focus on patient satisfaction and a commitment to excellence, Dr. Sicat and his team are dedicated to helping you achieve a healthy, beautiful smile that you can be proud of.</p>
          </div>
        </div>
      </div>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d240.49813632095191!2d120.65321133355158!3d15.323855582809538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396e9d805fb9ef1%3A0x7001bccd44e64eb8!2sArsenio%20P.%20Dizon%2C%20Concepcion%2C%20Tarlac!5e0!3m2!1sen!2sph!4v1679907580360!5m2!1sen!2sph" className='w-full h-96' style={{ border: 0 }} referrerPolicy={"no-referrer-when-downgrade"}></iframe>
    </div>
  )
};

export default AboutUs;
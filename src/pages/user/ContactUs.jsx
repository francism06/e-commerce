import React, { useEffect, useState } from 'react'
import { Header } from '../../components/Elements';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email_address: '',
    message: ''
  });

  const handleInput = (event) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      };
    });
  };

  const handleSubmit = () => {
    location.reload();
  };

  return (
    <div className='w-full flex flex-col gap-12 justify-center items-center'>
      <div className='w-full flex justify-center items-center bg-indigo-500 py-24'>
        <Header title={'We look forward to hearing from you!'} />
      </div>
      <div className='w-2/4 p-24 justify-center flex flex-col gap-8 bg-white border-2 border-black drop-shadow-primary-xl -translate-y-24 items-center'>
        <div className='flex flex-col w-full'>
          <label htmlFor="name">Name</label>
          <input className='input-field' onChange={handleInput} value={formData.name} type="text" name='name' id='name' />
        </div>
        <div className='flex flex-col w-full'>
          <label htmlFor="email_address">Email Address</label>
          <input className='input-field' onChange={handleInput} value={formData.email} type="email" name='email_address' id='email_address' />
        </div>
        <div className='flex flex-col w-full'>
          <label htmlFor="message">Message</label>
          <textarea className='resize-none input-field' onChange={handleInput} value={formData.message} name="message" id="message" cols="30" rows="10"></textarea>
        </div>
        <button onClick={handleSubmit} className='primary-btn'>Submit</button>
      </div>
    </div>
  )
};

export default ContactUs;
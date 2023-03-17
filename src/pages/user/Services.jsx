import React, { useState, useEffect } from 'react'

import { SecondaryButton, TertiaryButton } from '../../components/Elements';

const TEST_DATA = [
    {
        'name': 'Consultation',
        'description': 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio, tempore.',
        'image': '',
        'tags': 'Diagnostics',
        'price_start': '400',
        'price_end': '',
        'note': ''
    },
    {
        'name': 'Tooth Extraction',
        'description': 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi, quam.',
        'image': '',
        'tags': 'Surgery',
        'price_start': '500',
        'price_end': '2000',
        'note': 'per tooth'
    },
    {
        'name': 'Odontectomy',
        'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In, quo.',
        'image': '',
        'tags': 'Surgery',
        'price_start': '6000',
        'price_end': '15000',
        'note': 'per tooth'
    },
    {
        'name': 'Metal Post',
        'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, nisi!',
        'image': '',
        'tags': 'Endodontics',
        'price_start': '2500',
        'price_end': '',
        'note': ''
    },
    {
        'name': 'Oral Prophylaxis',
        'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, minus!',
        'image': '',
        'tags': 'Periodontics',
        'price_start': '600',
        'price_end': '2500',
        'note': ''
    },
    {
        'name': 'Ortho Treatment',
        'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, reprehenderit!',
        'image': '',
        'tags': 'Orthodontics',
        'price_start': '50000',
        'price_end': '100000',
        'note': '30% minimum down payment'
    },
    {
        'name': 'New Ace',
        'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, officia.',
        'image': '',
        'tags': 'Prosthodontics',
        'price_start': '14000',
        'price_end': '',
        'note': ''
    },
    {
        'name': 'Justi',
        'description': 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, delectus.',
        'image': '',
        'tags': 'Prosthodontics',
        'price_start': '20000',
        'price_end': '',
        'note': ''
    },
    {
        'name': 'ZOOM',
        'description': 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae, eveniet!',
        'image': '',
        'tags': 'Bleaching',
        'price_start': '25000',
        'price_end': '',
        'note': ''
    },
];

/**
 * @param {name, description, image, tags, price_start, price_end, note}
 * @returns void
 */
function ServiceCard ({ content = null, action = null }) {
    return (
        <div className={`bg-white text-black w-full h-full flex flex-col p-8  border-4 border-black drop-shadow-primary gap-8`}
        >
            <div className='flex flex-col w-full gap-4'>
                <h1 className='text-xl font-bold'>{content.name}</h1>
                <SecondaryButton label={content.tags} />
                <p>{content.description}</p>
            </div>
            <div>
                <TertiaryButton label={'Read More'} location={'/services'} CTA={true} />
            </div>
        </div>
    )
};

const Services = () => {
  return (
    <div className='grid grid-cols-3 gap-8 px-24 py-12'>
        {
            TEST_DATA.map((data, index) => {
                return (
                    <ServiceCard content={data} key={index} />
                )
            })
        }
    </div>
  )
};

export default Services
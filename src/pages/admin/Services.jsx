import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

/**
 * Service Details
 * 
 * name
 * description
 * image
 * price_start
 * price_end - nullable
 * tags
 * note
 */

const displayPrice = (priceStart, priceEnd = null) => {
  let priceString = `₱ ${priceStart}`;
  if (priceEnd !== null || priceEnd !== 0) {
    priceString += ` - ₱ ${priceEnd}`
  }

  return priceString;
};

const Services = () => {
  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    const getServices = async () => {
      const queryRef = collection(db, 'services');
      const querySnap = await getDocs(query(queryRef, orderBy('date_created', 'desc')));

      const service = new Array();
      querySnap.forEach((doc) => service.push({ id: doc.id, ...doc.data() }));

      setServiceList(service);
    };

    getServices();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 p-12">
      <div className="flex flex-row w-full justify-between items-center">
        <p className="font-bold text-secondary">Services</p>
        <Link className="bg-secondary px-4 py-2 text-white hover:bg-secondary-active" to={'create'}>Add Service</Link>
      </div>
      <div className="flex flex-col w-full h-full">
        <table className="w-full table-fixed border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-black drop-shadow-sm text-white">
              <th className="p-4 w-52 border-l border-y border-slate-200">Image</th>
              <th className="p-4 w-96 text-left border-y border-slate-200">Name</th>
              <th className="p-4 border-y border-slate-200">Price</th>
              <th className="p-4 border-y border-slate-200">Tag</th>
              <th className="p-4 border-y border-slate-200">Note</th>
              <th className="p-4 border-r-2 border-y border-slate-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              serviceList.length ? (
                serviceList.map((service, index) => {
                  return (
                    <tr key={index} className="bg-white border drop-shadow-sm text-center">
                      <td className="p-4 text-center border-l border-y border-slate-200">
                        <div className="flex justify-center items-center w-full h-full">
                          {
                            service.images.length ? (
                              <img className="h-24 object-fit" src={service.images[0].url} />
                            ) : (
                              <p>No image!</p>
                            )
                          }
                        </div>
                      </td>
                      <td className="p-4 border-y border-slate-200 text-left">
                        <p>{service.name}</p>
                      </td>
                      <td className="p-4 text-center border-y border-slate-200"><p>{displayPrice(service.price_start, service.price_end)}</p></td>
                      <td className="p-4 border-y border-slate-200">
                        <p>{service.tag}</p>
                      </td>
                      <td className="p-4 border-y border-slate-200">
                        <p>{service.note}</p>
                      </td>
                      <td className="p-4 text-center border-r-2 border-y border-slate-200">
                        <div className="flex w-full h-full justify-center items-center">
                          <Link className="px-4 py-2 border border-secondary text-secondary" to={`edit/${service.id}`} >Edit</Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">No services created!</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Services;
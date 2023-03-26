import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { PrimaryButton, SecondaryButton } from "../../components/Elements";

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

const Services = () => {
  const [serviceList, setServiceList] = useState([]);

  return (
    <div className="w-full h-full flex flex-col gap-4 p-12">
      <div className="flex flex-row w-full justify-between items-center">
        <p className="font-bold text-secondary">Services</p>
        <PrimaryButton label={'Add Service'} location={'create'} />
      </div>
      <div className="flex flex-col w-full h-full">
        <table className="w-full table-fixed border-separate border-spacing-y-6">
          <thead>
            <tr className="bg-secondary drop-shadow-primary text-white">
              <th className="p-4 w-52 border-l-2 border-y-2 border-black">Image</th>
              <th className="p-4 flex-1 text-left border-y-2 border-black">Name</th>
              <th className="p-4 w-32 border-y-2 border-black">Price</th>
              <th className="p-4 w-32 border-r-2 border-y-2 border-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              serviceList.length ? (
                serviceList.map((service, index) => {
                  return (
                    <tr key={index} className="bg-white border-2 drop-shadow-primary">
                      <td className="p-4 text-center border-l-2 border-y-2 border-black">
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
                      <td className="p-4 border-y-2 border-black">
                        <p>{service.name}</p>
                      </td>
                      <td className="p-4 text-center border-y-2 border-black"><p>{service.price}</p></td>
                      <td className="p-4 text-center border-r-2 border-y-2 border-black">
                        <div className="flex w-full h-full justify-center items-center">
                          <SecondaryButton label={'Edit'} location={`edit/${service.id}`} />
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
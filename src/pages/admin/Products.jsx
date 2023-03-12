import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

import { PrimaryButton, SecondaryButton } from "../../components/Elements";

/**
 * Product Details
 * 
 * name
 * description
 * image
 * price
 */

const Products = () => {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const queryRef = collection(db, 'products');
      const querySnap = await getDocs(query(queryRef, orderBy('date_created', 'desc')));

      const product = new Array();
      querySnap.forEach((doc) => product.push({ id: doc.id, ...doc.data() }));

      setProductList(product);
    };

    getProducts();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 p-12">
      <div className="flex flex-row w-full justify-between items-center">
        <p className="font-bold text-secondary">Products</p>
        <PrimaryButton label={'Create Product'} location={'create'} />
        {/* <Link to={'create'} className="px-4 py-2 bg-secondary text-white rounded-md">Create Product</Link> */}
      </div>
      <div className="flex flex-col w-full h-full">
        <table className="w-full table-fixed border-separate border-spacing-y-6">
          <thead>
            <tr className="bg-secondary drop-shadow-primary">
              <th className="p-4 w-52 text-white rounded-l-lg border-l-2 border-y-2 border-black">Image</th>
              <th className="p-4 flex-1 text-white text-left border-y-2 border-black">Name</th>
              <th className="p-4 w-32 text-white border-y-2 border-black">Quantity</th>
              <th className="p-4 w-32 text-white border-y-2 border-black">Price</th>
              <th className="p-4 w-32 text-white rounded-r-lg border-r-2 border-y-2 border-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              productList.length ? (
                productList.map((product, index) => {
                  return (
                    <tr key={index} className="bg-white border-2 drop-shadow-primary">
                      <td className="p-4 text-center rounded-l-lg border-l-2 border-y-2 border-black">
                        <div className="flex justify-center items-center w-full h-full">
                          {
                            product.images.length ? (
                              <img className="h-24 object-fit" src={product.images[0].url} />
                            ) : (
                              <p>No image!</p>
                            )
                          }
                        </div>
                      </td>
                      <td className="p-4 border-y-2 border-black">
                        <div className="flex flex-col">
                          <p className="font-bold">{product.name}</p>
                          <p className="text-slate-600">{product.description}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center border-y-2 border-black"><p>{product.quantity}</p></td>
                      <td className="p-4 text-center border-y-2 border-black"><p>{product.price}</p></td>
                      <td className="p-4 text-center rounded-r-lg border-r-2 border-y-2 border-black">
                        <div className="flex w-full h-full justify-center items-center">
                          <SecondaryButton label={'Edit'} location={`edit/${product.id}`} />
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">No products created!</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default Products;
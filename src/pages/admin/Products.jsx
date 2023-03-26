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
        <Link className="bg-secondary px-4 py-2 text-white hover:bg-secondary-active" to={'create'}>Create Product</Link>
      </div>
      <div className="flex flex-col w-full h-full">
        <table className="w-full table-fixed border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-black drop-shadow-sm text-white">
              <th className="p-4 w-52 border-l border-y border-slate-200">Image</th>
              <th className="p-4 flex-1 text-left border-y border-slate-200">Name</th>
              <th className="p-4 w-32 border-y border-slate-200">Quantity</th>
              <th className="p-4 w-32 border-y border-slate-200">Price</th>
              <th className="p-4 w-32 border-r border-y border-slate-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              productList.length ? (
                productList.map((product, index) => {
                  return (
                    <tr key={index} className="bg-white border drop-shadow-sm">
                      <td className="p-4 text-center border-l border-y border-slate-200">
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
                      <td className="p-4 border-y border-slate-200">
                        <div className="flex flex-col">
                          <p className="font-bold">{product.name}</p>
                          <p className="text-slate-600">{product.description}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center border-y border-slate-200"><p>{parseInt(product.quantity)}</p></td>
                      <td className="p-4 text-center border-y border-slate-200"><p>{product.price}</p></td>
                      <td className="p-4 text-center border-r border-y border-slate-200">
                        <div className="flex w-full h-full justify-center items-center">
                          <Link className="px-4 py-2 border border-secondary text-secondary" to={`edit/${product.id}`} >Edit</Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">No products created!</td>
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
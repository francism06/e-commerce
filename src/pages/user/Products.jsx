import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [filter, setFilter] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleSort = (event) => {
    setSort(event.target.value);
  };

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

  useEffect(() => {
    if (productList.length) {
      setFilteredList(productList);
    }
  }, [productList]);

  useEffect(() => {
    if (search !== '') {
      const matches = productList.filter((item) => {
        const regex = new RegExp(search, 'i');

        return item.name.match(regex);
      });

      setFilteredList(matches);
    } else {
      setFilteredList(productList);
    }
  }, [search]);

  useEffect(() => {
    if (sort !== '' && filteredList.length) {
      const temp = [...filteredList];

      setFilteredList(() => {
        if (sort === 'asc') {
          return temp.sort((a, b) => a.price - b.price);
        }

        if (sort === 'desc') {
          return temp.sort((a, b) => b.price - a.price);
        }
      });
    } else {
      setFilteredList(productList);
    }
  }, [sort]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex flex-row justify-center items-end gap-4 px-8 lg:px-24 py-4">
        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="search">Search</label>
          <input className="input-field" onChange={handleSearch} type="text" name="search" id="search" value={search} />
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <select className="p-2 input-field" onChange={handleSort} name="sort" id="sort">
            <option value="">Sort</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 px-12">
        {
          filteredList.map((product, index) => {
            return (
              <Link to={product.id} className="min-h-[24rem] w-full h-full flex flex-col  bg-white border-2 border-black drop-shadow-primary hover:drop-shadow-tertiary transition-all" key={index}>
                <div className="h-3/4 border-b-2 border-black flex justify-center items-center">
                  <img className={`w-full h-full object-contain ${product.images.length ? '' : 'p-8'}`} src={product.images.length ? product.images[0].url : '/Logo.png'} />
                </div>
                <div className="h-1/4 flex flex-col p-4 justify-between">
                  <p className="w-full">{product.name}</p>
                  <p className="w-full font-bold">₱ {product.price}</p>
                </div>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}

export default Products;
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

function Dashboard() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(userCollectionRef, { name1: name, age: Number(age) });
  };

  const updateUser = async (id, age) => {
    console.log("clicked");
    const userDoc = doc(db, "users", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    console.log("deleted");
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  return (
    console.log(users),
    (
      <div className="p-1">
        <input
          onChange={(event) => {
            setName(event.target.value);
          }}
          placeholder="Name..."
        />
        <input
          type="number"
          placeholder="Age..."
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <button onClick={createUser}> Create User </button>
        {users.map((user) => {
          return (
            <div className="flex flex-row justify-between">
              {" "}
              <h1>ID: {user.id}</h1>
              <h1>Name: {user.name}</h1>
              <h1>Age: {user.age}</h1>
              <button
                onClick={() => {
                  updateUser(user.id, user.age);
                }}
                className="border-solid border-black border p-1"
              >
                Increase age
              </button>
              <button
                className="border-solid border-black border p-1"
                onClick={() => {
                  deleteUser(user.id);
                }}
              >
                Delete User
              </button>
            </div>
          );
        })}
      </div>
    )
  );
}

export default Dashboard;

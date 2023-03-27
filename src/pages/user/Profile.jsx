import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { db, auth } from "../../config/firebase";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { onAuthStateChanged, signOut, updatePassword } from "firebase/auth";

const convertString = (string) => {
  return string !== '' && (string.charAt(0).toUpperCase() + string.slice(1)).replaceAll('_', ' ');
};

const Profile = () => {
  const [profileDetails, setProfileDetails] = useState({});
  const [currentProfileDetails, setCurrentProfileDetails] = useState({});
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [user, setUser] = useState({});
  const [password, setPassword] = useState({ new_password: '', confirm_password: '' })

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangeProfileDetails = (event) => {
    setProfileDetails((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      };
    });
  };

  const handleChangePassword = (event) => {
    setPassword((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    })
  }

  const handleEditProfile = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleEditPassword = () => {
    setIsChangingPassword((prevState) => !prevState);
  };

  const handleCancelProfile = () => {
    setProfileDetails(currentProfileDetails);
    handleEditProfile();
  };

  const handleCancelPassword = () => {
    setPassword({ new_password: '', confirm_password: '' });
    handleEditPassword();
  };

  /**
   * Update Firebase user details on submit.
   */
  const handleSaveProfile = async () => {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, profileDetails)

    setCurrentProfileDetails(profileDetails);
    handleEditProfile();
  };

  const handleSavePassword = async () => {
    if (password.new_password === '' && password.confirm_password === '') {
      return;
    }

    if (password.new_password !== password.confirm_password) {
      return;
    }

    const currUser = auth.currentUser;
    await updatePassword(currUser, password.new_password).then(() => location.reload());
  }

  const handleLogout = async () => {
    localStorage.clear();
    await signOut(auth).then(() => location.reload());
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDetails = JSON.parse(localStorage.getItem('user'));

        if (user.uid !== userDetails.uid) {
          localStorage.clear();
          signOut(auth).then(() => location.reload());
          return;
        }

        setUser(userDetails);
      } else {
        localStorage.clear();
        navigate('/');
      }
    });
  }, []);

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      const getProfileDetails = async () => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfileDetails(userSnap.data());
          setCurrentProfileDetails(userSnap.data());
        }
      };

      getProfileDetails();
    }
  }, [user]);

  useEffect(() => {
    if (Object.keys(profileDetails).length !== 0) {
      const getPurchaseHistory = async () => {
        const userRef = doc(db, 'users', user.uid);
        const q = query(collection(userRef, 'items'), where('delivery_status', 'in', ['order_placed', 'order_packed', 'order_shipped', 'order_delivered']), orderBy('date_created', 'desc'));
        const querySnapshot = await getDocs(q);

        const temp = [];
        querySnapshot.forEach((doc) => {
          temp.push({ docId: doc.id, ...doc.data() });
        });

        for (const value of temp) {
          const docRef = doc(db, 'products', value.product_id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const index = temp.findIndex((item) => item.product_id === value.product_id && item.product_details === undefined);
            temp[index].product_details = docSnap.data();
          }
        }

        setPurchaseHistory(temp);
      };

      getPurchaseHistory();
    }
  }, [profileDetails]);

  if (Object.keys(profileDetails).length === 0) {
    return (
      <div className="px-8">
        <div className='flex flex-col p-8 gap-2 w-full h-36 bg-slate-100 animate-pulse'>
          <div className="w-full h-8 bg-slate-300"></div>
          <div className="w-full h-8 bg-slate-300"></div>
          <div className="w-full h-8 bg-slate-300"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-8 px-24">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <p className="font-bold">My Profile</p>
            <p className="font-light">Manage your account.</p>
          </div>
          <div>
            <button className="bg-red-500 border-2 border-black text-white px-4 py-2" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="flex flex-col w-full bg-white border-2 border-black p-4 gap-4">
          {
            !isChangingPassword ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col w-full">
                    <label htmlFor="first_name">First Name</label>
                    <input value={profileDetails.first_name} onChange={handleChangeProfileDetails} className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="text" name="first_name" id="first_name" disabled={!isEditing} />
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor="last_name">Last Name</label>
                    <input value={profileDetails.last_name} onChange={handleChangeProfileDetails} className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="text" name="last_name" id="last_name" disabled={!isEditing} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email_address">Email Address</label>
                  <input value={profileDetails.email_address} onChange={handleChangeProfileDetails} className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="text" name="email_address" id="email_address" disabled={!isEditing} />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="contact_number">Contact Number</label>
                  <input value={profileDetails.contact_number} onChange={handleChangeProfileDetails} className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="text" name="contact_number" id="contact_number" disabled={!isEditing} />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="address">Address</label>
                  <input value={profileDetails.address} onChange={handleChangeProfileDetails} className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="text" name="address" id="address" disabled={!isEditing} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="new_password">New Password</label>
                    <input value={password.new_password} onChange={handleChangePassword} className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="password" name="new_password" id="new_password" />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <input value={password.confirm_password} onChange={handleChangePassword} className="border-2 border-black p-2 bg-white disabled:bg-slate-200 transition-all enabled:focus:drop-shadow-tertiary enabled:drop-shadow-primary" type="password" name="confirm_password" id="confirm_password" />
                  </div>
                </div>
                <div className="flex flex-row gap-4 justify-end">
                  <button onClick={handleCancelPassword} className="border-2 border-black bg-white px-4 py-2">Cancel</button>
                  <button onClick={handleSavePassword} className="border-2 border-black bg-white px-4 py-2">Save</button>
                </div>
              </div>
            )
          }
          {
            isChangingPassword ? null : (
              isEditing ? (
                <div className="flex flex-row gap-4 justify-end">
                  <button onClick={handleCancelProfile} className="border-2 border-black bg-white px-4 py-2">Cancel</button>
                  <button onClick={handleSaveProfile} className="border-2 border-black bg-white px-4 py-2">Save</button>
                </div>
              ) : (
                <div className="flex flex-row gap-4 justify-end">
                  <button onClick={handleEditPassword} className="border-2 border-black bg-white px-4 py-2">Change Password</button>
                  <button onClick={handleEditProfile} className="border-2 border-black bg-white px-4 py-2">Edit Profile</button>
                </div>
              )
            )
          }
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="flex flex-col">
          <p className="font-bold">Recent Purchased Products</p>
        </div>
        <table className="table-fixed">
          <thead>
            <tr className="text-white bg-black">
              <th className="p-2 w-32">Order Number</th>
              <th className="p-2 text-left">Product Name</th>
              <th className="p-2 w-32">Date of Purchase</th>
              <th className="p-2 w-32">Status</th>
              <th className="p-2 w-32">Total</th>
              <th className="p-2 w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              purchaseHistory.length ? (
                purchaseHistory.map((product, index) => {
                  return (
                    <tr key={index} className="text-center">
                      <td className="p-2 border-b-2 border-b-black"><p>{product.docId}</p></td>
                      <td className="p-2 border-b-2 border-b-black text-left"><p>{product?.product_details?.name}</p></td>
                      <td className="p-2 border-b-2 border-b-black"><p>{(product.date_created.toDate()).toLocaleDateString()}</p></td>
                      <td className="p-2 border-b-2 border-b-black"><p>{convertString(product?.delivery_status)}</p></td>
                      <td className="p-2 border-b-2 border-b-black"><p>₱ {product.total_price}</p></td>
                      <td className="p-2 border-b-2 border-b-black">
                        <div className="flex flex-row justify-center items-center">
                          <Link to={'tracking/' + product.docId} state={{ user: profileDetails, product: product }} className="border-2 border-black text-white bg-secondary p-2">View</Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="text-center p-2" colSpan={6}>
                    <p>No products purchased yet!</p>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div >
  )
};

export default Profile;
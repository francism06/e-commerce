import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    collection,
    collectionGroup,
    query,
    where,
    orderBy,
    arrayUnion
} from "firebase/firestore";
import { Icon } from "@iconify/react";

const PAYMENT_METHOD = [
    {
        label: 'Cash on Delivery',
        method: 'cod'
    },
    {
        label: 'PayPal',
        method: 'paypal'
    }
];

const DELIVERY_STATUS = [
    {
        status: 'order_placed',
        name: 'Order Placed',
        description: 'Order has been placed.'
    },
    {
        status: 'order_packed',
        name: 'Order Packed',
        description: 'Order has been packed.'
    },
    {
        status: 'order_shipped',
        name: 'Order Shipped',
        description: 'Order has been shipped.'
    },
    {
        status: 'order_delivered',
        name: 'Order Delivered',
        description: 'Order has been delivered.'
    }
];

const convertDateToString = (date) => {
    return `${new Date(date).toDateString()} | ${new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const ViewTransaction = () => {
    const [transactionDetails, setTransactionDetails] = useState({});
    const [userDetails, setUserDetails] = useState({});

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const { id } = useParams();
    let { state } = useLocation();

    const updateDeliveryStatus = async (event) => {
        const index = event.target.value;

        const docRef = doc(db, 'users', transactionDetails?.userRef, 'items', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            navigate('transactions');
            location.reload();
        }

        const status = {
            ...DELIVERY_STATUS[index],
            date_created: Date.now()
        };

        await updateDoc(docRef, {
            delivery_status: DELIVERY_STATUS[index].status,
            status: arrayUnion(status)
        });

        setTransactionDetails((prevState) => {
            const newStatus = prevState.status && prevState.status.length ? [...prevState.status, status] : status;
            return {
                ...prevState,
                delivery_status: DELIVERY_STATUS[index].status,
                status: [...newStatus]
            };
        });
    };

    const handleFulfillPayment = async (event) => {
        if (!Object.keys(userDetails).length || !Object.keys(transactionDetails).length) {
            return;
        }

        const docRef = doc(db, 'users', transactionDetails.userRef, 'items', id);
        await updateDoc(docRef, {
            is_paid: !transactionDetails.is_paid
        });

        setTransactionDetails((prevState) => {
            return {
                ...prevState,
                is_paid: !transactionDetails.is_paid
            }
        });
    };

    const checkButtonState = (paymentMethod, deliveryStatus) => {
        if (paymentMethod !== 'cod') {
            return true;
        }

        if (deliveryStatus !== 'order_delivered') {
            return true;
        }

        return false;
    };

    useEffect(() => {
        if (!id || user === null || Object.keys(state.transactionDetails).length === 0) {
            navigate('transactions');
            location.reload();
        }

        const initializeTransactionDetails = async () => {
            const docRef = doc(db, 'users', state?.transactionDetails?.userRef, 'items', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                navigate('transactions');
                location.reload();
            }

            setTransactionDetails({ ...docSnap.data(), docId: docSnap.id, userRef: state?.transactionDetails?.userRef });
        };

        initializeTransactionDetails();
    }, []);

    useEffect(() => {
        if (!Object.keys(transactionDetails).length) {
            return;
        }

        const getUserDetails = async () => {
            const userRef = doc(db, 'users', transactionDetails.userRef);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                navigate('transactions');
                location.reload();
            }

            setUserDetails(userSnap.data());
        };

        getUserDetails();
    }, [transactionDetails]);

    if (!Object.keys(transactionDetails).length) {
        return (
            <div className='p-8'>
                <div className="flex flex-col p-8 gap-2 w-full h-36 bg-slate-200 animate-pulse">
                    <div className="w-full h-8 bg-slate-300"></div>
                    <div className="w-full h-8 bg-slate-300"></div>
                    <div className="w-full h-8 bg-slate-300"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-row p-8 gap-4">
            <div className="flex flex-col gap-4 w-3/5">
                <div className="w-full flex flex-row justify-between bg-white border border-slate-200 drop-shadow-sm rounded-lg p-4">
                    <Link className="flex flex-row items-center" to={'../transactions'}><Icon icon="clarity:angle-line" rotate={3} />Back</Link>
                    <div className="flex flex-row items-center">
                        <p>ORDER ID:</p>
                        <p>{transactionDetails.docId}</p>
                    </div>
                </div>
                <div className="w-full flex flex-col bg-white border border-slate-200 drop-shadow-sm rounded-lg p-4">
                    <div className="flex flex-row items-center">
                        <p className="font-bold">Product Details</p>
                    </div>
                    <table className="text-left">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="p-2">Product ID</th>
                                <th className="p-2">Quantity</th>
                                <th className="p-2">Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2">
                                    <p>{transactionDetails.product_id}</p>
                                </td>
                                <td className="p-2">
                                    <p>{transactionDetails.quantity}</p>
                                </td>
                                <td className="p-2">
                                    <p>₱ {transactionDetails.total_price}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="w-full flex flex-col bg-white border border-slate-200 drop-shadow-sm rounded-lg p-4">
                    <div className="flex flex-row items-center">
                        <p className="font-bold">Order Details</p>
                    </div>
                    <table className="text-left">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="p-2">Payment Method</th>
                                <th className="p-2">Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2">
                                    <p>
                                        {
                                            PAYMENT_METHOD[PAYMENT_METHOD.findIndex((payment) => transactionDetails.payment_method === payment.method)]?.label
                                        }
                                    </p>
                                </td>
                                <td className="p-2">
                                    <p>{transactionDetails.is_paid.toString()}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex flex-row gap-4 justify-end">
                        <select value={DELIVERY_STATUS.findIndex((state) => state.status === transactionDetails.delivery_status)} className="p-2 border border-slate-200" name="delivery_status" id="delivery_status" onChange={updateDeliveryStatus}>
                            {
                                DELIVERY_STATUS.map((state, index) => {
                                    return (
                                        <option key={index} value={index}>{state.name}</option>
                                    )
                                })
                            }
                        </select>
                        <button onClick={handleFulfillPayment} className={`${transactionDetails.is_paid ? 'bg-red-500 hover:bg-red-300' : 'bg-secondary hover:bg-secondary-active'} py-2 px-4 text-white disabled:bg-slate-200 disabled:text-slate-700`} disabled={(transactionDetails && checkButtonState(transactionDetails.payment_method, transactionDetails.delivery_status))} >
                            {
                                transactionDetails.is_paid ? 'Unfulfill Payment' : 'Fulfill Payment'
                            }
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <div>
                        <p className="font-bold">Timeline</p>
                    </div>
                    <hr className="border border-slate-200 rounded-lg" />
                    <div className="flex flex-col-reverse gap-4 w-full">
                        {
                            transactionDetails.status && transactionDetails.status.length ? (
                                transactionDetails.status.map((status, index) => {
                                    return (
                                        <div className={`grid grid-cols-2 ${index === (transactionDetails.status.length - 1) ? '' : 'text-slate-600 font-light'}`} key={index}>
                                            <p className={`${index === (transactionDetails.status.length - 1) ? 'font-bold' : ''}`}>{convertDateToString(status.date_created)}</p>
                                            <div className="flex flex-col">
                                                <p className={`${index === (transactionDetails.status.length - 1) ? 'font-bold' : ''}`}>{status.name}</p>
                                                <p>{status.description}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div>
                                    <p>No status available.</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="w-2/5 h-fit flex flex-col bg-white drop-shadow-sm rounded-lg border border-slate-200">
                <div className="flex flex-col gap-2 p-4">
                    <div>
                        <p className="font-bold">Customer Details</p>
                    </div>
                    <div>
                        <div className="flex flex-col">
                            <p>{`${userDetails.first_name} ${userDetails.last_name}`}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 border-t-2 border-slate-200 p-4">
                    <div>
                        <p className="font-bold">Contact Information</p>
                    </div>
                    <div>
                        <div className="flex flex-col">
                            <p>{userDetails.email_address}</p>
                            <p>{userDetails.contact_number}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 border-t-2 border-slate-200 p-4">
                    <div>
                        <p className="font-bold">Address</p>
                    </div>
                    <div>
                        <div className="flex flex-col">
                            <p>{userDetails.address !== '' ? userDetails.address : 'No Address!'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewTransaction;
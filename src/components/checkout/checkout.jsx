import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { db } from '../../firebase/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import './checkout.css';

export function Checkout() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { hotel, startDate: initialStartDate, endDate: initialEndDate, numberGuests: initialNumberGuests, numberChildren: initialNumberChildren } = location.state || {};
    const [startDate, setStartDate] = useState(initialStartDate || '');
    const [endDate, setEndDate] = useState(initialEndDate || '');
    const [numberGuests, setNumberGuests] = useState(initialNumberGuests || 1);
    const [numberChildren, setNumberChildren] = useState(initialNumberChildren || 0);
    const [name, setName] = useState("");
    const [roomSize, setRoomSize] = useState('medium'); 

    const hotelName = hotel?.name || "Test Hotel Suites";
    const hotelAddress = hotel?.address || "1234 Hotel Ave";
    const baseRate = hotel?.rate || "0";
    const todayDate = new Date();
    const today = todayDate.toISOString().split('T')[0];
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    const decimalBaseRate = parseFloat(baseRate.replace(/[^0-9.-]+/g, '')); 

    let totalCost = diffInDays * decimalBaseRate * (numberGuests + (numberChildren * 0.2)) * (roomSize === "small" ? 1 : roomSize === "medium" ? 1.25 : 1.5);

    useEffect(() => {
        if (currentUser) {
            const fetchUserName = async () => {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const fullName = `${userData.firstName} ${userData.lastName}`;
                    setName(formatName(fullName)); 
                }
            };
            fetchUserName();
        }
    }, [currentUser]);

    // Function to format the name properly
    const formatName = (name) => {
        return name
            .split(' ') 
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); 
            })
            .join(' '); 
    };



    const onSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            navigate('/login');
            return;
        }

        const userId = currentUser.uid;
        const bookingData = {
            hotelName,
            hotelAddress,
            startDate,
            endDate,
            name,
            numberGuests,
            numberChildren,
            roomSize,
            totalCost,
        };

        try {
            const bookingsRef = collection(db, 'users', userId, 'bookings');
            const bookingDocRef = await addDoc(bookingsRef, bookingData);
            console.log('Booking saved successfully with ID:', bookingDocRef.id);
            navigate('/confirmation');
        } catch (error) {
            console.error('Error saving booking: ', error);
        }
    };

    return (
        <div className="bookingDetails">
            <h1>Booking Details</h1>
            <div className="checkout">
                <div className="formTitle">Hotel Name: {hotelName}</div>
                <div className="checkoutForm">
                    <div className="formRow">
                        <div className="input">
                            <label className="form-label">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="input">
                            <label className="form-label">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="input">
                            <label className="form-label">Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                    <div className="formRow">
                        <div className="input">
                            <label className="form-label">Number of Guests</label>
                            <input type="number" value={numberGuests} onChange={(e) => setNumberGuests(Number(e.target.value))} />
                        </div>
                        <div className="input">
                            <label className="form-label">Number of Children</label>
                            <input
                                type="number"
                                value={numberChildren}
                                onChange={(e) => setNumberChildren(Number(e.target.value))}  
                            />
                        </div>             
                        <div className="input">
                            <label className="form-label">Room Size</label>
                            <select value={roomSize} onChange={(e) => setRoomSize(e.target.value)}>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="king">King</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="confirm">
                    <div>Total Booking Cost: ${totalCost}</div>
                    <button onClick={onSubmit} type="button">Continue</button>
                </div>
            </div>
            <div>
                <h4>Hotel Address: {hotelAddress}</h4>
            </div>
        </div>
    );
}

export default Checkout;

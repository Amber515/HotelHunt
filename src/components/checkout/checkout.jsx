import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';  
import { db } from '../../firebase/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import "./checkout.css";

export function Checkout() {
    const { currentUser } = useAuth(); // To access the logged-in user
    const navigate = useNavigate(); 

    // Example booking details
    let exampleBooking = {
        startDate: '2024-11-25',
        endDate: '2024-11-26',
        hotelAddress: "1234 Hotel Ave",
        hotelName: "Test Hotel Suites",
        roomSize: "small",
        numberAdults: 1,
        numberChildren: 0,
        baseRate: 100,
    };

    const [name, setName] = useState(""); // Set initial empty name
    const [numberAdults, setNumberAdults] = useState(exampleBooking.numberAdults);
    const [numberChildren, setNumberChildren] = useState(exampleBooking.numberChildren);
    const [startDate, setStartDate] = useState(exampleBooking.startDate);
    const [endDate, setEndDate] = useState(exampleBooking.endDate);
    const [roomSize, setRoomSize] = useState(exampleBooking.roomSize);

    const todayDate = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    const today = todayDate.toISOString().split('T')[0];

    let totalCost = (exampleBooking.baseRate * (numberAdults + (numberChildren * 0.5)) * diffInDays) * (roomSize === "small" ? 1 : roomSize === "medium" ? 1.25 : 1.5);

    // Function to add a day to the date
    function addDay(dateTime) {
        let date = new Date(dateTime);
        date.setDate(date.getDate() + 1);
        let newDateString = date.toISOString().split('T')[0];
        return newDateString;
    }

    // Function to subtract a day from the date
    function minusDay(dateTime) {
        let date = new Date(dateTime);
        date.setDate(date.getDate() - 1);
        let newDateString = date.toISOString().split('T')[0];
        return newDateString;
    }

    // Function to format the name (capitalize first letter of each word)
    const formatName = (name) => {
        return name
            .split(' ')
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ');
    };

    // Fetch user's first and last name from Firestore
    useEffect(() => {
        const fetchUserName = async () => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        // Format the name and set it
                        const fullName = `${userData.firstName} ${userData.lastName}`;
                        setName(formatName(fullName)); // Format and then set name
                    } else {
                        console.log('No such user found!');
                    }
                } catch (error) {
                    console.error('Error fetching user data: ', error);
                }
            }
        };

        fetchUserName();
    }, [currentUser]);

    // Function to handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            // If not logged in, we will prompt the user to log in or register
            navigate('/login');
            return;
        }

        const userId = currentUser.uid;

        const bookingData = {
            hotelName: exampleBooking.hotelName,
            hotelAddress: exampleBooking.hotelAddress,
            roomSize,
            startDate,
            endDate,
            name,
            numberAdults,
            numberChildren,
            totalCost,
        };

        try {
            // Save the booking data under the user's 'bookings' subcollection in Firestore
            const bookingsRef = collection(db, 'users', userId, 'bookings');
            const bookingDocRef = await addDoc(bookingsRef, bookingData); // This will automatically generate a unique document ID

            console.log('Booking saved successfully with ID:', bookingDocRef.id);
            navigate('/confirmation');  // Redirect to confirmation page after successful booking
        } catch (error) {
            console.error("Error saving booking: ", error);
        }
    };

    return (
        <div className='bookingDetails'>
            <h1>Booking Details</h1>
            <div className='checkout'>
                <div className='formTitle'>
                    Booking for: {exampleBooking.hotelAddress}
                </div>
                <div className='checkoutForm'>
                    <div className='formRow'>
                        <div className="input">
                            <label className="form-label">Start</label>
                            <input 
                                type="date" 
                                value={startDate}
                                required="required"
                                min={today} 
                                max={minusDay(endDate)} 
                                onChange={(e) => {
                                    if (e.target.value !== "") {
                                        setStartDate(e.target.value);
                                    } else {
                                        let newStartDate = exampleBooking.startDate > endDate ? today : exampleBooking.startDate;
                                        e.target.value = newStartDate;
                                        setStartDate(newStartDate);
                                    }
                                }} 
                            />
                        </div>
                        <div className="input">
                            <label className="form-label">End</label>
                            <input 
                                type="date" 
                                value={endDate}
                                required="required" 
                                min={addDay(startDate)} 
                                onChange={(e) => {
                                    if (e.target.value !== "") {
                                        setEndDate(e.target.value);
                                    } else {
                                        e.target.value = addDay(startDate);
                                        setEndDate(addDay(startDate));
                                    }
                                }} 
                            />
                        </div>
                        <div className="input">
                            <label className="form-label">Name</label>
                            <input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                    </div>
                    <div className='formRow'>
                        <div className="input">
                            <label className="form-label">Room Size</label>
                            <select 
                                name='roomSize' 
                                id='roomSize' 
                                value={roomSize} 
                                onChange={(e) => setRoomSize(e.target.value)}
                            >
                                <option value='small'>Small</option>
                                <option value='medium'>Medium</option>
                                <option value='large'>Large</option>
                            </select>
                        </div>
                        <div className="input">
                            <label className="form-label">Number of Adults</label>
                            <input 
                                type="number" 
                                min={1} 
                                value={numberAdults} 
                                onChange={(e) => setNumberAdults(parseInt(e.target.value))} 
                            />
                        </div>
                        <div className="input">
                            <label className="form-label">Number of Children</label>
                            <input 
                                type="number" 
                                min={0} 
                                value={numberChildren} 
                                onChange={(e) => setNumberChildren(parseInt(e.target.value))} 
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='confirm'>
                <div style={{ paddingRight: ".5rem" }}>Total Booking Cost: ${totalCost}</div>
                <button onClick={onSubmit} type="button">
                    Continue
                </button>
            </div>
        </div>
    );
}

export default Checkout;

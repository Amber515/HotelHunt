import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';  
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; 

const BookingDetails = () => {
    const { currentUser } = useAuth(); 
    const [userData, setUserData] = useState(null);  
    const [bookingData, setBookingData] = useState([]); 
    const [errorMessage, setErrorMessage] = useState(''); 

    // Fetch user and booking data from Firestore
    const fetchData = async () => {
        if (currentUser) {
            try {
                // Fetch user data from Firestore
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    console.log('User not found in Firestore.');
                    setErrorMessage('User not found in Firestore.');
                }

                // Fetch bookings data from Firestore
                const bookingsRef = collection(db, 'users', currentUser.uid, 'bookings');
                const bookingsSnapshot = await getDocs(bookingsRef);

                if (!bookingsSnapshot.empty) {
                    // Get all bookings
                    const allBookings = bookingsSnapshot.docs.map(doc => doc.data()); 
                    setBookingData(allBookings);
                } else {
                    console.log('No bookings found.');
                    setErrorMessage('No bookings found.');
                }
            } catch (error) {
                console.error('Error fetching data: ', error.message);
                setErrorMessage('Error fetching data: ' + error.message);
            }
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [currentUser]);

    return (
        <div className="container mt-5">
            <main>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-center">Booking History</h3>

                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                                {userData && (
                                    <div className="mb-4">
                                        <h4>User Information</h4>
                                        <p><strong>First Name:</strong> {userData.firstName}</p>
                                        <p><strong>Last Name:</strong> {userData.lastName}</p>
                                        <p><strong>Email:</strong> {userData.email}</p>
                                        <p><strong>Phone Number:</strong> {userData.phone}</p>
                                        <p><strong>Date of Birth:</strong> {userData.dateOfBirth}</p>
                                    </div>
                                )}
                                {bookingData.length > 0 ? (
                                    bookingData.map((booking, index) => (
                                        <div key={index} className="mb-4">
                                            <h4>Booking {index + 1}</h4>
                                            <p><strong>Hotel Name:</strong> {booking.hotelName}</p>
                                            <p><strong>Check-In Date:</strong> {booking.checkInDate}</p>
                                            <p><strong>Check-Out Date:</strong> {booking.checkOutDate}</p>
                                            <p><strong>Number of Guests:</strong> {booking.numberOfGuests}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No bookings to display.</p>
                                )}

                                {!userData && !bookingData && !errorMessage && (
                                    <p>Loading user and booking details...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookingDetails;

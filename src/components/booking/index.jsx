import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';  
import { addUserForm, addBooking } from '../../firebase/firebase';  
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';  

const Booking = () => {
    const { currentUser } = useAuth(); 
    const navigate = useNavigate(); 

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [hotelName, setHotelName] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch additional user data from Firestore if the user is logged in
    useEffect(() => {
        if (currentUser) {
            // Set email from currentUser 
            setEmail(currentUser.email || '');
            
            // Fetch firstName and lastName from Firestore
            const userRef = doc(db, 'users', currentUser.uid); 
            getDoc(userRef).then(docSnap => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setFirstName(userData.firstName || ''); 
                    setLastName(userData.lastName || '');  
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        }
    }, [currentUser]);


    const onSubmit = async (e) => {
        e.preventDefault();

        let userId;

        if (!currentUser) {
            // Call the addUserForm function 
            const userResult = await addUserForm(email, password, firstName, lastName);
            if (userResult.error) {
                setErrorMessage(userResult.error);
                return;
            }
            userId = userResult.userId; 
        } else {
            userId = currentUser.uid; 
        }

        setIsBooking(true);

        const bookingData = {
            hotelName,
            checkInDate,
            checkOutDate,
            numberOfGuests,
        };

        const bookingResult = await addBooking(userId, bookingData); 

        if (bookingResult.error) {
            setErrorMessage(bookingResult.error);
        } else {
            console.log('Booking successful:', bookingResult.bookingId);
            navigate('/');  
        }

        setIsBooking(false);
    };

    return (
        <div className="container mt-5">
            <main>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-center">Booking Information</h3>
                                <form onSubmit={onSubmit} className="mt-4">
                                    <div className="mb-3" style={{ width: "30%" }}>
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            autoComplete="firstname"
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3" style={{ width: "30%" }}>
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            autoComplete="lastname"
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>

                                        <div className="mb-3" style={{ width: "30%" }}>
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                autoComplete="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                    <div className="mb-3" style={{ width: "30%" }}>
                                        <label className="form-label">Phone number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            autoComplete="phone"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3" style={{ width: "30%" }}>
                                        <label className="form-label">Date of Birth</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            autoComplete="dateOfBirth"
                                            required
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                        />
                                    </div>

                                    {!currentUser && (
                                        <div className="mb-3" style={{ width: "30%" }}>
                                            <label className="form-label">Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                autoComplete="new-password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                                    <div>
                                        <label>Hotel Name</label>
                                        <input
                                            type="text"
                                            value={hotelName}
                                            onChange={(e) => setHotelName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Check-In Date</label>
                                        <input
                                            type="date"
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Check-Out Date</label>
                                        <input
                                            type="date"
                                            value={checkOutDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Number of Guests</label>
                                        <input
                                            type="number"
                                            value={numberOfGuests}
                                            onChange={(e) => setNumberOfGuests(e.target.value)}
                                            required
                                            min="1"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isBooking}
                                        className="btn btn-primary custom-btn w-30"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Booking;

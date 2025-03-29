import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';  
import { addUserForm, addBooking } from '../../firebase/firebase';  
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';  
import { useParams } from 'react-router-dom';

const EditBooking = () => {
	const { bookingId } = useParams();
    const { currentUser } = useAuth(); 
    const navigate = useNavigate(); 

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hotelName, setHotelName] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
	const [bookingDocId, setBookingDocId] = useState();

    const isFormComplete = 
        firstName.trim() !== '' && 
        lastName.trim() !== '' &&
        email.trim() !== '' &&
        password.trim() !== '' &&
        hotelName.trim() !== '' &&
        checkInDate !== '' &&
        checkOutDate !== '';

    // Fetch additional user data from Firestore if the user is logged in
    useEffect(() => {
        if (currentUser) {
            // Set email from currentUser 
			setEmail(currentUser.email || '');

			// Get booking document
			const bookingRef = doc(db, "users", currentUser.uid, "bookings", bookingId);
			getDoc(bookingRef).then(docSnap => {
				if(docSnap.exists()) {
					setBookingDocId(bookingId);
					const docData = docSnap.data();
					setNumberOfGuests(docData.numberOfGuests);
					setCheckInDate(docData.checkInDate);
					setCheckOutDate(docData.checkOutDate);
					setHotelName(docData.hotelName);
				} else {
					setBookingDocId(null);
				}
			});

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

		// Set booking doc
		await setDoc(doc(db, "users", currentUser.uid, "bookings", bookingId), {
			...bookingData
		}, { merge: true });

		navigate('/bookings');  

        setIsBooking(false);
    };

	if(bookingDocId === null) {
		return <p>Booking does not exist</p>;
	}

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
                                        <label className="bookingLabel">Hotel Name</label>
                                        <input
                                            type="text"
                                            value={hotelName}
                                            onChange={(e) => setHotelName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="bookingLabel">Check-In Date</label>
                                        <input
                                            type="date"
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="bookingLabel">Check-Out Date</label>
                                        <input
                                            type="date"
                                            value={checkOutDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="bookingLabelLast">Number of Guests</label>
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
                                        className={`btn w-30 ${
                                            isFormComplete 
                                                ? 'btn-light custom-btn-white' 
                                                : 'btn-primary custom-btn'
                                        }`}
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

export default EditBooking;

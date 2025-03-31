import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';  
import { addUserForm } from '../../firebase/firebase';  
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
    const [roomSize, setRoomSize] = useState('');
    const [numberGuests, setNumberOfGuests] = useState(1);
    const [numberChildren, setNumberOfChildren] = useState(0);
    const [baseRate, setBaseRate] = useState(0);
    const [isBooking, setIsBooking] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
	const [bookingDocId, setBookingDocId] = useState();

    const totalCost = baseRate * (parseInt(numberGuests) + (numberChildren * 0.2)) * ((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)) * (roomSize === "small" ? .75 : roomSize === "medium" ? 1 : 1.25);
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dayAfterStartDate = checkInDate ? new Date(new Date(checkInDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : tomorrow;

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
					setNumberOfGuests(docData.numberGuests);
                    setNumberOfChildren(docData.numberChildren);
					setCheckInDate(docData.startDate);
					setCheckOutDate(docData.endDate);
					setHotelName(docData.hotelName);
                    setRoomSize(docData.roomSize);
                    setBaseRate(calcBaseRate(docData.roomSize, docData.numberGuests, docData.numberChildren, docData.startDate, docData.endDate, docData.totalCost));
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
    }, [currentUser, bookingId]);


    const onSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            // Call the addUserForm function 
            const userResult = await addUserForm(email, password, firstName, lastName);
            if (userResult.error) {
                setErrorMessage(userResult.error);
                return;
            }
        }

        setIsBooking(true);

        const bookingData = {
            hotelName,
            startDate: checkInDate,
            endDate: checkOutDate,
            numberGuests,
            numberChildren,
            roomSize,
            totalCost
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
                                        <label className="bookingLabel">Check-In Date</label>
                                        <input
                                            type="date"
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            min={today}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="bookingLabel">Check-Out Date</label>
                                        <input
                                            type="date"
                                            value={checkOutDate}
                                            min={dayAfterStartDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="bookingLabelLast">Number of Guests</label>
                                        <input
                                            type="number"
                                            value={numberGuests}
                                            onChange={(e) => setNumberOfGuests(e.target.value)}
                                            required
                                            min="1"
                                        />
                                    </div>

                                    <div>
                                        <label className="bookingLabelLast">Number of Children</label>
                                        <input
                                            type="number"
                                            value={numberChildren}
                                            onChange={(e) => setNumberOfChildren(e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label" style={{paddingRight:".5rem"}}>Room Size</label>
                                        <select value={roomSize} onChange={(e) => setRoomSize(e.target.value)}>
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="king">King</option>
                                        </select>
                                    </div>

                                    <div>
                                        <div>New Total Booking Cost: ${totalCost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</div>
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

function calcBaseRate(roomSize, numberGuests, numberChildren, startDate, endDate, totalCost) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Calculate the number of days between the two dates

    let sizeRate = 0;
    if (roomSize === 'small') {
        sizeRate = .75;
    } else if (roomSize === 'medium') {
        sizeRate = 1;
    } else if (roomSize === 'king') {
        sizeRate = 1.25;
    }

    // Calculate the total cost based on the number of guests and children
    const baseRate = totalCost / ((parseInt(numberGuests) + numberChildren*.2) * sizeRate * days);
    return baseRate; // Return the calculated base rate
}

export default EditBooking;

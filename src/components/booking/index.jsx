import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';  
import { addUserForm, addBooking } from '../../firebase/firebase';  

const Booking = () => {
    const { currentUser } = useAuth(); 

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hotelName, setHotelName] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);

    const navigate = useNavigate(); 
    const [isBooking, setIsBooking] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form submission for signing up or booking
    const onSubmit = async (e) => {
        e.preventDefault();

        let userId;

        if (!currentUser) {
            // Call the addUserForm function (sign up the user)
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
            // Booking was successful, navigate to home
            console.log('Booking successful:', bookingResult.bookingId);
            navigate('/home');  
        }

        setIsBooking(false);
    };


    return (
        <div className="container mt-5">
            {/* {userLoggedIn && (<Navigate to={'/booking'} replace={true} />)} */}
            <main>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-center">Booking Information</h3>
                                <form onSubmit={onSubmit} className="mt-4">
                                    <div className="mb-3" style={{ width: "30%" }}  >
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            autoComplete='firstname'
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3" style={{ width: "30%" }}  >
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            autoComplete='lastname'
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3" style={{ width: "30%" }}  >
                                        <label className="form-label">Phone number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            autoComplete='phone'
                                            required
                                            value={phone}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3" style={{ width: "30%" }}  >
                                        <label className="form-label">Date of Birth</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            autoComplete='dateOfBirth'
                                            required
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                        />
                                    </div>
                                    {!currentUser && (
                                    <div className="mb-3" style={{ width: "30%" }}  >
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            autoComplete='email'
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    )}
                                    {!currentUser && (
                                        <div className="mb-3" style={{ width: "30%" }}  >
                                            <label className="form-label">Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                autoComplete='current-password'
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Error message display */}
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
                                        className={`btn btn-primary custom-btn  w-30`}>
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

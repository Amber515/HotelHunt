import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';  // Assuming useAuth hook exists in the authContext
import { addUserForm } from '../../firebase/firebase'; // Import addUserForm from Firebase
import { firestore } from '../../firebase/firebase';  // Firestore reference (if needed)
import { getAuth } from 'firebase/auth'; // Modular SDK Auth

const Booking = () => {
    const { userLoggedIn } = useAuth(); // Assuming this is working properly

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form submission for signing up
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);

            // Call the addUserForm function (sign up the user)
            const result = await addUserForm(email, password, firstName, lastName);

            if (result.error) {
                setErrorMessage(result.error);  // Show error message if any
            } else {
                // Successfully signed up and saved user in Firestore
                // You can redirect or do other actions here
            }

            setIsSigningIn(false);
        }
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
                                    {!userLoggedIn && (
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
                                    <button
                                        type="submit"
                                        disabled={isSigningIn}

                                        Navigate to={'/home'} 

                                        className={`btn btn-primary custom-btn  w-30 ${isSigningIn ? 'disabled' : ''}`}>
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

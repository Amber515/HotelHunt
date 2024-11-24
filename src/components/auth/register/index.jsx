import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/firebase';  

const Register = () => {
    const { userLoggedIn } = useAuth(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');   
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        if (!isRegistering) {
            setIsRegistering(true);
            try {
                // Create a new user with Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // After creating the user, store additional user information in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    firstName,
                    lastName,
                    email: user.email,
                    uid: user.uid,
                    createdAt: new Date(),
                });

                // Redirect user to home page after successful registration (if required)
                setIsRegistering(false);
            } catch (error) {
                setErrorMessage(error.message);  
                setIsRegistering(false);
            }
        }
    };

    // If the user is logged in, redirect to home
    if (userLoggedIn) {
        return <Navigate to={'/home'} replace={true} />;
    }

    return (
        <>
            <main className="container d-flex align-items-center justify-content-center vh-100">
                <div className="card shadow border rounded p-4" style={{ width: '25rem' }}>
                    <h3 className="text-center text-gray-800 mb-4">Create a New Account</h3>
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                autoComplete="given-name"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                autoComplete="family-name"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete="off"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        {errorMessage && (
                            <div className="text-danger mb-3">{errorMessage}</div>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`btn btn-primary custom-btn w-100 ${isRegistering ? 'disabled' : ''}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="text-center mt-3">
                            <span className="text-sm">Already have an account? </span>
                            <Link to={'/login'} className="text-primary fw-bold">Log In</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Register;

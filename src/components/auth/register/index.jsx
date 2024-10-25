import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';

const Register = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            await doCreateUserWithEmailAndPassword(email, password);
        }
    };

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <main className="container d-flex align-items-center justify-content-center vh-100">
                <div className="card shadow border rounded p-4" style={{ width: '25rem' }}>
                    <h3 className="text-center text-gray-800 mb-4">Create a New Account</h3>
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                autoComplete='email'
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
                                autoComplete='new-password'
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
                                autoComplete='off'
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
                            className={`btn btn-primary w-100 ${isRegistering ? 'disabled' : ''}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>

                        <div className="text-center mt-3">
                            <span className="text-sm">Already have an account? </span>
                            <Link to={'/login'} className="text-primary fw-bold">Continue</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Register;

import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password);
        }
    };

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false);
            });
        }
    };

    return (
        
        <div className="container mt-5">
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
            <main>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-center">Please Sign In</h3>
                                <form onSubmit={onSubmit} className="mt-4">
                                    <div className="mb-3">
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
                                    <div className="mb-3">
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

                                    {errorMessage && (
                                        <div className="alert alert-danger">{errorMessage}</div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSigningIn}
                                        className={`btn btn-primary custom-btn  w-100 ${isSigningIn ? 'disabled' : ''}`}>
                                        {isSigningIn ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </form>
                                <p className="mt-3 text-center">
                                    Don't have an account? <Link to={'/register'}>Sign up</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.min.js"></script>

            </main>
        </div>
    );
}

export default Login;

import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import './index.css';

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const isFormComplete = 
        email.trim() !== '' &&
        password.trim() !== '';

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true); 
            const result = await doSignInWithEmailAndPassword(email, password);
            
            if (result.error) {
                setErrorMessage(result.error); 
            } 
            setIsSigningIn(false); 
        }
    };

    return (
        <div className="container mt-5">
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
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
                                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Error message display */}
                                    <button
                                        type="submit"
                                        disabled={isSigningIn}
                                        className={`btn btn-primary custom-btn  w-100 ${isFormComplete 
                                            ? 'btn-light custom-btn-white' 
                                            : 'btn-primary custom-btn'} 
                                            ${isSigningIn ? 'disabled' : ''}`}>
                                        {isSigningIn ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </form>
                                <p className="mt-3 text-center">Forgot your Password? <Link to={'/reset'} className="text-center text-sm hover:underline font-bold">Reset it here</Link></p>
                                <p className="mt-3 text-center">Don't have an account? <Link to={'/register'} className="text-center text-sm hover:underline font-bold">Register it here</Link></p>                     
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

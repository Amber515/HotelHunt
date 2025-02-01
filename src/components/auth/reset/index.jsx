import React, { useState } from 'react';
import { resetPassword } from '../../../firebase/auth';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext'; 

const ResetPassword = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isSubmitting) {
      setIsSubmitting(true);
      const result = await resetPassword(email);
      if (result.success) {
        setMessage('Password reset email sent! Check your inbox.');
        setErrorMessage('');
      } else {
        setErrorMessage(result.error);
        setMessage('');
      }
      setIsSubmitting(false);
    }
  };

  if (userLoggedIn) return <Navigate to={'/'} replace={true} />; // Redirect if logged in

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center">Reset Password</h3>
              <form onSubmit={handleResetPassword} className="mt-4">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-primary custom-btn  w-100 ${isSubmitting ? 'disabled' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Password Reset Email'}
                </button>
              </form>
              {message && <div className="alert alert-success mt-3">{message}</div>}
              {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
              <p className="mt-3 text-center">
                Remember your password? <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

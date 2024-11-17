import { React, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import "./index.css";


const Home = () => {
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        console.log("Current User:", currentUser);  // This will log currentUser whenever it changes
      }, [currentUser]);

    return (
        <>
            <div className='searchBar'>
                <div className="input">
                    <label className="form-label">Destination</label>
                    <input
                        placeholder='City, State'
                        className="form-control"
                    />
                </div>
                <div className="input">
                    <label className="form-label">Start</label>
                    <input type="date"></input>
                </div>
                <div className="input">
                    <label className="form-label">End</label>
                    <input type="date"></input>
                </div>
                <div className="input">
                    <label className="form-label"># of Guests</label>
                    <input
                        className="form-control"
                        type='number'
                        min={1}
                    />
                </div>
                <button type="submit">
                    Search
                </button>
            </div>


            <div className="welcome">
                <div>Hello {currentUser ? currentUser.displayName ? currentUser.displayName : currentUser.email.substr(0,currentUser.email.indexOf('@')) : "Guest"}!</div>
                <div>{currentUser ? "View your existing bookings here:": "Log in to start booking"}</div>
                <button onClick={() => currentUser ? navigate("/bookings") : navigate("/login")}>
                    {currentUser ? "Check Bookings": "Log In"}
                </button>
            </div>
        </>
    )
}

export default Home
import { React, useEffect } from 'react';
import {useAuth} from '../../contexts/authContext';
import {useNavigate} from 'react-router-dom';
import "./index.css";


const Home = ({setHotels}) => {
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        console.log("Current User:", currentUser);  // This will log currentUser whenever it changes
      }, [currentUser]);
    
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(e)

        let city = e.target[0].value.trim().toLowerCase()
        if(city !== "")  {
            setHotels([])
            navigate('/search?city=' + city)
        }
    }

    return (
        <>
            <SearchForm handleSubmit={handleSubmit}/>

            <div className="welcome">
                <div>Hello {getCurrentUserName(currentUser)}!</div>
                <div>{currentUser ? "View your existing bookings here:": "Log in to start booking"}</div>
                <button className="loginBtn" onClick={() => currentUser ? navigate("/bookings") : navigate("/login")}>
                    {currentUser ? "Check Bookings": "Log In"}
                </button>
            </div>
        </>
    )
}

export function SearchForm({handleSubmit}) {
    return (
        <form className='searchBar' onSubmit={handleSubmit}>
                <div className="input">
                    <label className="form-label">Destination</label>
                    <input
                        placeholder='City'
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
                <button type="submit" className='searchBtn'>
                    Search
                </button>
            </form>
    )
}

function getCurrentUserName(currentUser) {
    return currentUser ? 
        currentUser.displayName ? 
            currentUser.displayName : 
            currentUser.email.substr(0,currentUser.email.indexOf('@')) : 
        "Guest"
}

export default Home
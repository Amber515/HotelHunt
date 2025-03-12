import { React, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./index.css";

const Home = ({ setHotels }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [numberGuests, setNumberGuests] = useState(1);

    useEffect(() => {
        console.log("Current User:", currentUser);  
    }, [currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let city = e.target[0].value.trim().toLowerCase();
        if (city !== "") {
            axios.get('https://hotelhunt.adam-z.dev/gethotels/cityname?cityname=' + city).then(function (response) {
                console.log(response.data);
                setHotels(response.data);
                navigate('/search', {
                    state: {
                        city,
                        startDate,
                        endDate,
                        numberGuests
                    }
                });
            })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            console.log("Please complete all fields");
        }
    };

    return (
        <>
            <SearchForm 
                handleSubmit={handleSubmit} 
                setCity={setCity} 
                setStartDate={setStartDate} 
                setEndDate={setEndDate} 
                setNumberGuests={setNumberGuests} 
                startDate={startDate} 
                endDate={endDate} 
                numberGuests={numberGuests} 
            />
            <div className="welcome">
                <div>Hello {getCurrentUserName(currentUser)}!</div>
                <div>{currentUser ? "View your existing bookings here:" : "Log in to start booking"}</div>
                <button className="loginBtn" onClick={() => currentUser ? navigate("/bookings") : navigate("/login")}>
                    {currentUser ? "Check Bookings" : "Log In"}
                </button>
            </div>
        </>
    );
}


export function SearchForm({ handleSubmit, setCity, setStartDate, setEndDate, setNumberGuests, startDate, endDate, numberGuests }) {
    return (
        <form className='searchBar' onSubmit={handleSubmit}>
            <div className="input">
                <label className="form-label">Destination</label>
                <input
                    placeholder='City'
                    className="form-control"
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <div className="input">
                <label className="form-label">Start</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                />
            </div>
            <div className="input">
                <label className="form-label">End</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                />
            </div>
            <div className="input">
                <label className="form-label"># of Guests</label>
                <input
                    className="form-control"
                    type='number'
                    min={1}
                    value={numberGuests} 
                    onChange={(e) => setNumberGuests(e.target.value)} 
                />
            </div>
            <button type="submit" className='searchBtn'>
                Search
            </button>
        </form>
    );
}

function getCurrentUserName(currentUser) {
    return currentUser ? 
        currentUser.displayName ? 
            currentUser.displayName : 
            currentUser.email.substr(0, currentUser.email.indexOf('@')) : 
        "Guest";
}

export default Home;

import { React, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./home.css";

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
        if (city.trim() !== "") {
            axios.get('https://hotelhunt.adam-z.dev/gethotels/cityname?cityname=' + city.toLowerCase()).then(function (response) {
                console.log(response.data);
                setHotels(response.data);
                navigate('/search?city=' + city, {
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
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dayAfterStartDate = startDate ? new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;
    const dayBeforeEndDate = endDate ? new Date(new Date(endDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;
    return (
        <form className='searchBar' onSubmit={handleSubmit}>

            <div className="input">
                <label className="form-label">Destination</label>
                <input
                    placeholder='City'
                    defaultValue={new URLSearchParams(window.location.search).get('city') || ""}
                    className="form-control"
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <div className="input">
                <label className="form-label">Start</label>
                <input 
                    type="date" 
                    defaultValue={startDate} 
                    min={today}
                    onChange={(e) => {setStartDate(e.target.value); if (e.target.value > dayBeforeEndDate) setEndDate('')}}
                />
            </div>
            <div className="input">
                <label className="form-label">End</label>
                <input 
                    type="date" 
                    value={endDate}
                    min={startDate? dayAfterStartDate : tomorrow}
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

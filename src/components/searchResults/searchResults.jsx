
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar } from "react-icons/fa";
import './searchResults.css';
import { SearchForm } from '../home';


function SearchResults({ hotels, setHotels }) {
    const location = useLocation();
    const navigate = useNavigate();

    const { city, startDate, endDate, numberGuests } = location.state || {};

    useEffect(() => {
        if (city) {
            fetchHotels(city);
        }
    }, [city]);

    const fetchHotels = (city) => {
        setHotels([]);
        axios.get('https://hotelhunt.adam-z.dev/gethotels/cityname?cityname=' + city.toLowerCase())
            .then(function (response) {
                setHotels(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleHotelClick = (hotel) => {
        const numberAdults = numberGuests; 
        const numberChildren = 0; 

        // Pass hotel, startDate, endDate, numberGuests, numberChildren to Checkout page
        navigate('/checkout', {
            state: {
                hotel,
                startDate,
                endDate,
                numberGuests,
                numberChildren,
            }
        });
    };

    return (
        <>
            <SearchForm 
                city={city} 
                startDate={startDate} 
                endDate={endDate} 
                numberGuests={numberGuests} 
                handleSubmit={() => {}}
            />
            {hotels.map((hotel, i) => (
                <div key={i} onClick={() => handleHotelClick(hotel)} style={{ cursor: 'pointer' }}>
                    <HotelListing hotel={hotel} />
                </div>
            ))}

        </>
    );
}


function HotelListing({ hotel }) {
    return (
        <div className="hotelListing">
            <div className='hotelListingTop'>
                <div className='hotelListingTopLeft'>
                    <div className="hotelListingItem">Hotel Name: {hotel.name}</div>
                    <div className="hotelListingItem">Hotel Rating: <Rating rating={hotel.rating} /></div>
                    <div className="hotelListingItem" style={{ textTransform: "capitalize" }}>Hotel Address: {hotel.address.toLowerCase()}</div>
                </div>
                <div className='hotelListingTopRight'>
                    <div className="hotelListingItem">Hotel Number: {formatPhoneNumber(hotel.phoneNumber)}</div>
                    <div className="hotelListingItem">Hotel Rate: ${hotel.rate} Per Adult/Night</div>
                </div>
            </div>
        </div>
    );
}

function Rating({ rating }) {
    let stars;
    switch (rating) {
        case "OneStar": stars = 1; break;
        case "TwoStar": stars = 2; break;
        case "ThreeStar": stars = 3; break;
        case "FourStar": stars = 4; break;
        case "FiveStar": stars = 5; break;
        default: stars = 0;
    }
    return stars
}

function formatPhoneNumber(phoneNumber) {
    let cleaned = ('' + phoneNumber).replace(/\D/g, '');
    if (cleaned.length === 11) {
        let formatted = cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1-$2-$3-$4');
        return formatted;
    } else {
        return phoneNumber;
    }
}

export default SearchResults;

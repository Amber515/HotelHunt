import { useEffect } from 'react';
import {SearchForm} from '../home'
import { FaStar, FaRegStar } from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import axios from 'axios'
import './searchResults.css'

function SearchResults({hotels, setHotels}) {
    const navigate = useNavigate();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const city = params.get('city');
        if (city) {
            fetchHotels(city);
        }
    }, []);

    const fetchHotels = (city) => {
        setHotels([]);
        axios.get('https://hotelhunt.adam-z.dev/gethotels/cityname?cityname=' + city.toLowerCase())
            .then(function(response){
                console.log(response.data);
                setHotels(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const city = e.target[0].value.trim().toLowerCase();
        if (city !== "") {
            navigate('/search?city=' + city);
            fetchHotels(city);
        }
    };

    let listings = [];
    for (let i = 0; i < hotels.length; i++) {
        listings.push(<div id={i}><HotelListing hotel={hotels[i]}/></div>);
    }

    return (
        <>
            <SearchForm handleSubmit={handleSubmit}/>
            {listings}
        </>
    );
}

function formatPhoneNumber(phoneNumber) {
    // Remove all non-numeric characters
    let cleaned = ('' + phoneNumber).replace(/\D/g, '');

    // Check if the cleaned number has 11 digits
    if (cleaned.length === 11) {
        // Format the number as (X-XXX-XXX-XXXX)
        let formatted = cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1-$2-$3-$4');
        return formatted;
    } else {
        // Return the original phone number if it doesn't have 11 digits
        return phoneNumber;
    }
}

function HotelListing({hotel}) {
    return (
        <div className="hotelListing">
            <div className='hotelListingTop'>
                
                <div className='hotelListingTopLeft'>
                    <div className="hotelListingItem">Hotel Name: {hotel.name}</div>
            
                    <div className="hotelListingItem">Hotel Rating: <Rating rating={hotel.rating}/></div>

                    <div className="hotelListingItem" style={{textTransform:"capitalize"}}>Hotel Address: {hotel.address.toLowerCase()}</div>
                </div>
                
                <div className='hotelListingTopRight'>
                    <div className="hotelListingItem">Hotel Number: {formatPhoneNumber(hotel.phoneNumber)}</div>
        
                    <div className="hotelListingItem">Hotel Rate: {hotel.rate} Per Adult/Night</div>
                </div>
                
            </div>
            
            <div className="hotelListingItem" style={{ marginTop: "16px" }}dangerouslySetInnerHTML={{ __html: "Hotel Description: " + hotel.description }}/>
        </div>
    );
}

function Rating({rating}) {
    let stars;
    switch(rating) {
        case "OneStar":   stars = 1; break;
        case "TwoStar":   stars = 2; break;
        case "ThreeStar": stars = 3; break;
        case "FourStar":  stars = 4; break;
        case "All":
        case "FiveStar":  stars = 5; break;
        default: stars = 0;
    }

    let starIcons = [];
    for(let i = 0; i < 5; i++) {
        starIcons.push(i < stars ? <FaStar key={i}/> : <FaRegStar key={i}/>);
    }

    return starIcons;
}

export default SearchResults;
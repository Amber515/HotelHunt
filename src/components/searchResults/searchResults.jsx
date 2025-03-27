
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar } from "react-icons/fa";
import './searchResults.css';
import { SearchForm } from '../home/home';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ReactPaginate from 'react-paginate';
import { Spinner } from 'react-bootstrap';

 
function SearchResults({ hotels, setHotels }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [city, setCity] = useState(location.state?.city || '');
    const [startDate, setStartDate] = useState(location.state?.startDate || '');
    const [endDate, setEndDate] = useState(location.state?.endDate || '');
    const [numberGuests, setNumberGuests] = useState(location.state?.numberGuests || 1);
    const [sort, setSort] = useState("none");
    const sortByRateAscending = (a, b) => parseFloat(a.rate.replace(/[^0-9.-]+/g, "")) - parseFloat(b.rate.replace(/[^0-9.-]+/g, ""));
    const sortByRateDescending = (a, b) => sortByRateAscending(b, a);
    const sortByRating = (a, b) => convertRating(a.rating) - convertRating(b.rating);
    const sortByRatingDescending = (a, b) => sortByRating(b, a);
    
    let sortedHotels = hotels

    switch(sort) {
        case "rateAscending": sortedHotels.sort(sortByRateAscending); break;
        case "rateDescending": sortedHotels.sort(sortByRateDescending); break;
        case "ratingAscending": sortedHotels.sort(sortByRating); break;
        case "ratingDescending": sortedHotels.sort(sortByRatingDescending); break;
        default: break;
    }

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
            .then(function (response) {
                setHotels(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let city = e.target[0].value.trim()
        if (city !== "") {
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
                setCity={setCity}
                startDate={startDate} 
                setStartDate={setStartDate}
                endDate={endDate} 
                setEndDate={setEndDate}
                numberGuests={numberGuests} 
                setNumberGuests={setNumberGuests}
                handleSubmit={handleSubmit}
            />
            <div className="sort">
                 <DropdownButton id="dropdown-basic-button" title="Sort by Rating">
                     <Dropdown.Item onClick={() => setSort("ratingAscending")}>Sort by Rating (Low to High)</Dropdown.Item>
                     <Dropdown.Item onClick={() => setSort("ratingDescending")}>Sort by Rating (High to Low)</Dropdown.Item>
                 </DropdownButton>
                 <DropdownButton id="dropdown-basic-button" title="Sort by Rate">
                     <Dropdown.Item onClick={() => setSort("rateAscending")}>Sort by Rate (Low to High)</Dropdown.Item>
                     <Dropdown.Item onClick={() => setSort("rateDescending")}>Sort by Rate (High to Low)</Dropdown.Item>
                 </DropdownButton>
             </div>


             {
                sortedHotels.length > 0 ? 
                <PaginatedHotelListings 
                itemsPerPage={10} 
                hotels={sortedHotels} 
                handleHotelClick={handleHotelClick}
            /> :<Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span> </Spinner>
             }
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
                    <div className="hotelListingItem">Hotel Rate: {hotel.rate} Per Adult/Night</div>
                </div>
            </div>
        </div>
    );
}

function convertRating(rating) {
    let stars;
    switch (rating) {
        case "OneStar": stars = 1; break;
        case "TwoStar": stars = 2; break;
        case "ThreeStar": stars = 3; break;
        case "FourStar": stars = 4; break;
        case "All":
        case "FiveStar": stars = 5; break;
        default: stars = 0;
    }
    return stars
}

function Rating({rating}) {
    let stars = convertRating(rating);

    let starIcons = [];
    for(let i = 0; i < 5; i++) {
        starIcons.push(i < stars ? <FaStar key={i}/> : <FaRegStar key={i}/>);
    }

    return starIcons;
}

function PaginatedHotelListings({ itemsPerPage, hotels, handleHotelClick }) {
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = hotels.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(hotels.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % hotels.length;
        setItemOffset(newOffset);
    };
    return (
        <>
            {}
            {currentItems.map((hotel, i) => (
                <div 
                    key={i} 
                    onClick={() => handleHotelClick(hotel)} 
                    style={{ cursor: 'pointer' }}
                >
                    <HotelListing hotel={hotel} />
                </div>
            ))}

            {}
            <ReactPaginate
                className='pagination'
                pageClassName='page'
                previousClassName='previous'
                nextClassName='next'
                activeClassName='active'
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
            />
        </>
    );
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

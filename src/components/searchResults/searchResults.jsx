import { useState, useEffect } from 'react';
import {SearchForm} from '../home'
import { FaStar, FaRegStar } from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import axios from 'axios'
import './searchResults.css'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ReactPaginate from 'react-paginate';

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

    return (
        <>
            <SearchForm handleSubmit={handleSubmit}/>
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
            <PaginatedHotelListings itemsPerPage={10} hotels={hotels}/>
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

function PaginatedHotelListings({itemsPerPage, hotels}) {
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;

    const currentItems = hotels.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(hotels.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % hotels.length;
        setItemOffset(newOffset);
    };
    
    let listings = [];
    for (let i = 0; i < currentItems.length; i++) {
        listings.push(<div id={i}><HotelListing hotel={currentItems[i]}/></div>);
    }
    
    return (
        <>
          {listings}
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

function convertRating(rating) {
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

export default SearchResults;
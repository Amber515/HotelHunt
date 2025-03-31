import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { db } from '../../firebase/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import './checkout.css';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { FaStar, FaRegStar } from "react-icons/fa";

export function Checkout() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { hotel, startDate: initialStartDate, endDate: initialEndDate, numberGuests: initialNumberGuests, numberChildren: initialNumberChildren } = location.state || {};
    const [startDate, setStartDate] = useState(initialStartDate || '');
    const [endDate, setEndDate] = useState(initialEndDate || '');
    const [numberGuests, setNumberGuests] = useState(parseInt(initialNumberGuests) || 1);
    const [numberChildren, setNumberChildren] = useState(initialNumberChildren || 0);
    const [name, setName] = useState("");
    const [roomSize, setRoomSize] = useState('medium'); 
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [hotelLatLng, setHotelLatLng] = useState(null); 
    const [isMapsLoaded, setIsMapsLoaded] = useState(false); 

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dayAfterStartDate = startDate ? new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : tomorrow;
    const dayBeforeEndDate = endDate ? new Date(new Date(endDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;

    const hotelName = hotel?.name || "Test Hotel Suites";
    const hotelAddress = hotel?.address || "1234 Hotel Ave";
    const baseRate = hotel?.rate || "0";
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    const decimalBaseRate = parseFloat(baseRate.replace(/[^0-9.-]+/g, '')); 
    
    let totalCost = Math.round(diffInDays * decimalBaseRate * (numberGuests + (numberChildren * 0.2)) * (roomSize === "small" ? .75 : roomSize === "medium" ? 1 : 1.25) * 100) / 100;

    useEffect(() => {
        if (currentUser) {
            const fetchUserName = async () => {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const fullName = `${userData.firstName} ${userData.lastName}`;
                    setName(formatName(fullName)); 
                }
            };
            fetchUserName();
        }

        if (hotel && hotel.address && isMapsLoaded) {
            geocodeAddress(hotel.address);
        }
    }, [currentUser, hotel, isMapsLoaded]);

    // Function to format the name properly
    const formatName = (name) => {
        return name
            .split(' ') 
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); 
            })
            .join(' '); 
    };

    const geocodeAddress = async (address) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK') {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();
                setHotelLatLng({ lat, lng });
            } else {
                console.error("Geocode was not successful for the following reason: " + status);
            }
        });
    };

    function formatPhoneNumber(phoneNumber) {
        let cleaned = ('' + phoneNumber).replace(/\D/g, '');
        if (cleaned.length === 11) {
            let formatted = cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1-$2-$3-$4');
            return formatted;
        } else {
            return phoneNumber;
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            navigate('/login');
            return;
        }

        const userId = currentUser.uid;
        const bookingData = {
            hotelName,
            hotelAddress,
            startDate,
            endDate,
            name,
            numberGuests,
            numberChildren,
            roomSize,
            totalCost,
        };

        if (!startDate || !endDate || !name) {
            alert('Please fill out all fields');
            return;
        }

        try {
            const bookingsRef = collection(db, 'users', userId, 'bookings');
            const bookingDocRef = await addDoc(bookingsRef, bookingData);
            console.log('Booking saved successfully with ID:', bookingDocRef.id);
            navigate('/confirmation');
        } catch (error) {
            console.error('Error saving booking: ', error);
        }
    };

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

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

    const center = hotelLatLng || { lat: 40.748817, lng: -73.985428 };

    return (
        <div className="bookingDetails">
            <h1>Booking Details</h1>
            <div className="checkout">
                <div className="formTitle">Hotel Name: {hotelName}</div>
                <div className="checkoutForm">
                    <div className="formRow">
                        <div className="input">
                            <label className="form-label">Start Date</label>
                            <input type="date" value={startDate} min={today} onChange={(e) => {setStartDate(e.target.value); if (e.target.value > dayBeforeEndDate) setEndDate('')}} />
                        </div>
                        <div className="input">
                            <label className="form-label">End Date</label>
                            <input type="date" value={endDate} min={dayAfterStartDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="input">
                            <label className="form-label">Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                    <div className="formRow">
                        <div className="input">
                            <label className="form-label">Number of Guests</label>
                            <input type="number" value={numberGuests} onChange={(e) => setNumberGuests(Number(e.target.value))} />
                        </div>
                        <div className="input">
                            <label className="form-label">Number of Children</label>
                            <input
                                type="number"
                                value={numberChildren}
                                onChange={(e) => setNumberChildren(Number(e.target.value))}  
                            />
                        </div>             
                        <div className="input">
                            <label className="form-label">Room Size</label>
                            <select value={roomSize} onChange={(e) => setRoomSize(e.target.value)}>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="king">King</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="confirm" style={{display:"flex", flexDirection:"row", alignItems:"center", gap:".5rem"}}>
                    <div>Total Booking Cost: ${totalCost}</div>
                    <button onClick={onSubmit} type="button">Continue</button>
                </div>
            </div>

            <br></br>
            <br></br>

            {/* Flexbox Layout for Map and Description */}
            <div className="map-and-description" style={{ display: "flex", gap: "20px", paddingLeft: '30px' }}>
                <div style={{ flex: 1 }}>
                <h2>Hotel Location on Map</h2>
                    <LoadScript
                        googleMapsApiKey="AIzaSyAUogeRGQHa2xil-vldFMXoyJMdgPI3C2s"
                        onLoad={() => setIsMapsLoaded(true)}
                    >
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={14}
                        >
                            {hotelLatLng && (
                                <Marker
                                    position={hotelLatLng}
                                    onClick={() => setSelectedHotel(hotel)}
                                />
                            )}

                            {selectedHotel && (
                                <InfoWindow
                                    position={hotelLatLng}
                                    onCloseClick={() => setSelectedHotel(null)}
                                >
                                    <div>
                                        <h3>{selectedHotel.name}</h3>
                                        <p>{hotelAddress}</p>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </LoadScript>
                    <br></br>
                    <h2>Contact information</h2>
                    <div>

                    <div className="hotelListingItem">{hotel.name}</div>
                    <div className="hotelListingItem" style={{ textTransform: "capitalize" }}>{hotel.address.toLowerCase()}</div>
                </div>
                <div className='hotelListingTopRight'>
                    <div className="hotelListingItem">Phone Number: {formatPhoneNumber(hotel.phoneNumber)}</div>
                    <div className="hotelListingItem">Hotel Rate: {hotel.rate} Per Adult/Night</div>
                    <div className="hotelListingItem">Hotel Rating: <Rating rating={hotel.rating} /></div>
                    </div>
                </div>

                {/* Hotel Description on the Right */}
                <div style={{ flex: 1 }}>
                <h2>Hotel Description</h2>
                <div
                    className="hotel-description"
                    dangerouslySetInnerHTML={{ __html: hotel.description }}
                />
            </div>
            </div>
        </div>
    );
}

export default Checkout;

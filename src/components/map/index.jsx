import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const HotelMap = () => {
    const [selectedHotel, setSelectedHotel] = useState(null);
    const hotels = [
        { id: 1, name: 'Hotel One', lat: 40.748817, lng: -73.985428 },  // Example Hotel Data
        { id: 2, name: 'Hotel Two', lat: 40.749817, lng: -73.986428 },
        // Add more hotels here
    ];

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

    const center = {
        lat: 40.748817,
        lng: -73.985428,
    };

    return (
        <div>
            <h2>Hotel Search Map</h2>
            <LoadScript googleMapsApiKey="AIzaSyB8lNdpf-ywSYfPAugfek-fmwPy4FzrHAk">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={14}
                >
                    {hotels.map((hotel) => (
                        <Marker
                            key={hotel.id}
                            position={{ lat: hotel.lat, lng: hotel.lng }}
                            onClick={() => setSelectedHotel(hotel)}
                        />
                    ))}

                    {selectedHotel && (
                        <InfoWindow
                            position={{
                                lat: selectedHotel.lat,
                                lng: selectedHotel.lng,
                            }}
                            onCloseClick={() => setSelectedHotel(null)}
                        >
                            <div>
                                <h3>{selectedHotel.name}</h3>
                                <p>Details about the hotel...</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default HotelMap;

import { React, useEffect } from 'react';
import {useAuth} from '../../contexts/authContext';
import {useNavigate} from 'react-router-dom';
import axios from 'axios'
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
            // axios.get('https://hotelhunt.adam-z.dev/gethotels/cityname?cityname=' + city).then(function(response){
            //     console.log(response.data)
            //     setHotels(response.data)
            //     navigate('/search')
            // }
            // ).catch(function (error) {
            //     console.log(error)
            // })
            setHotels([
                {
                  "id": "1117130",
                  "name": "Thumb Heritage Inn",
                  "rating": "All",
                  "address": "405 W Sanilac Rd SanduskyMichigan 48471 ",
                  "description": "Set in Sandusky, Thumb Heritage Inn offers barbecue facilities. Among the facilities at this property are room service and a 24-hour front desk, along with free WiFi throughout the property. The hotel has family rooms.\n\nAll air-conditioned units at the hotel come with a fridge, a microwave, a coffee machine, a shower, free toiletries, a flat-screen TV with cable channels and DVD player. All guest rooms feature a private bathroom, a hairdryer and bed linen.\n\nGuests at Thumb Heritage Inn can enjoy a continental breakfast.\n\nThe nearest airport is Sarnia Chris Hadfield Airport, 95 km from the accommodation. Guests are required to show a photo identification and credit card upon check-in. Please note that all Special Requests are subject to availability and additional charges may apply.\nPlease be advised that pets are only allowed in certain room types. All pets must be requested and approved prior to guest check-in.",
                  "coordinates": "43.42095|-82.84044",
                  "phoneNumber": "+18106484811",
                  "rate": "$528.49"
                },
                {
                  "id": "1043774",
                  "name": "Commodore Perry Inn and Suites",
                  "rating": "TwoStar",
                  "address": "255 West Lakeshore Drive Port ClintonOH 43452 ",
                  "description": "\u003Cp\u003E\u003Cb\u003EProperty Location\u003C/b\u003E \u003Cbr /\u003EWith a stay at Commodore Perry Inn and Suites, you'll be centrally located in Port Clinton, within a 15-minute drive of Fisherman's Wharf and Ottawa County Visitor's Bureau.  This golf hotel is 11.4 mi (18.3 km) from The Islander Golf & Country Club and 12.1 mi (19.4 km) from Liberty Aviation Museum.\u003C/p\u003E\u003Cp\u003E\u003Cb\u003ERooms\u003C/b\u003E \u003Cbr /\u003EMake yourself at home in one of the 69 guestrooms featuring refrigerators and microwaves. Complimentary wireless Internet access is available to keep you connected. Bathrooms have showers and hair dryers. Conveniences include safes and coffee/tea makers, as well as phones with free local calls.\u003C/p\u003E\u003Cp\u003E\u003Cb\u003EAmenities\u003C/b\u003E \u003Cbr /\u003EDon't miss out on recreational opportunities including a nightclub and an indoor pool. Additional features at this hotel include complimentary wireless Internet access and wedding services.\u003C/p\u003E\u003Cp\u003E\u003Cb\u003EDining\u003C/b\u003E \u003Cbr /\u003EEnjoy a satisfying meal at Mr Eds Bar and Grille serving guests of Commodore Perry Inn and Suites.\u003C/p\u003E\u003Cp\u003E\u003Cb\u003EBusiness, Other Amenities\u003C/b\u003E \u003Cbr /\u003EFeatured amenities include express check-out, a 24-hour front desk, and laundry facilities. Planning an event in Port Clinton? This hotel has 13433 square feet (116 square meters) of space consisting of conference space and a meeting room. Free self parking is available onsite.\u003C/p\u003E",
                  "coordinates": "41.51745|-82.94482",
                  "phoneNumber": "1 419 7322645",
                  "rate": "$176.80"
                },
                {
                  "id": "1072169",
                  "name": "Maples Motel",
                  "rating": "TwoStar",
                  "address": "4409 Cleveland Road SanduskyOhio 44870-4429 ",
                  "description": "Located in Sandusky, 9 km from Cedar Point Amusement Park, Maples Motel provides accommodation with a seasonal outdoor swimming pool, free private parking and a garden. All rooms feature a TV with cable channels and a private bathroom. The motel features family rooms.\n\nGuest rooms will provide guests with a fridge.\n\nKalahari Waterpark Resort is 12 km from the motel, while Castaway Bay Waterpark is 4.4 km away. The nearest airport is Cleveland Hopkins International Airport, 81 km from Maples Motel. Guests are required to show a photo identification and credit card upon check-in. Please note that all Special Requests are subject to availability and additional charges may apply.",
                  "coordinates": "41.42116|-82.63408",
                  "phoneNumber": "+1(0)4196261575",
                  "rate": "$175.93"
                }])
            navigate("/search")
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
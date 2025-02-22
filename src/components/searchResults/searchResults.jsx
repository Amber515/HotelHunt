import {SearchForm} from '../home'
import './searchResults.css'
function SearchResults({hotels, setHotels}) {
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    let listings = []
    for(let i=0; i<hotels.length; i++) {
        listings.push(<div id={i}><HotelListing hotel={hotels[i]}/></div>)
    }

    return (
        <>
            <SearchForm handleSubmit={handleSubmit}/>
            {listings}
        </>
    )
}

function HotelListing({hotel}) {
    return (
        //Adding hover text with descrption on Image
        <div className="hotelListing">
            
            <div className='hotelListingTop'>
                
                <div className='hotelListingTopLeft'>
                    <div className="hotelListingItem">Hotel Name: {hotel.name}</div>
            
                    <div className="hotelListingItem">Hotel Rating: {hotel.rating}</div>

                    <div className="hotelListingItem" style={{textTransform:"capitalize"}}>Hotel Address: {hotel.address.toLowerCase()}</div>
                </div>
                
                <div className='hotelListingTopRight'>
                    <div className="hotelListingItem">Hotel Number: {hotel.phoneNumber}</div>
        
                    <div className="hotelListingItem">Hotel Rate: {hotel.rate}</div>
                </div>
                
            </div>
            
            <div className="hotelListingItem" dangerouslySetInnerHTML={{ __html: "Hotel Description: " + hotel.description }}/>
          
        </div>
    )
}

export default SearchResults
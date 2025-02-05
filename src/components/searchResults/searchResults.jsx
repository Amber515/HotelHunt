import {SearchForm} from '../home'
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
        <div>
            Hotel Name: {hotel.name}
        
            Hotel Rating: {hotel.rating}
        
            Hotel Address: {hotel.address}
        
            Hotel Description: {hotel.description}
       
            Hotel location: {hotel.cordinates}
       
            Hotel Number: {hotel.phoneNumber}
       
            Hotel Rate: {hotel.rate}
        </div>
    )
}

export default SearchResults
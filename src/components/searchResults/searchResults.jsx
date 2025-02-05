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
        <div>
            Hotel Name: {hotel.name}
        </div>
    )
}

export default SearchResults
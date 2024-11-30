import { React, useState } from 'react'
import "./checkout.css"

export function Checkout() {
    let exampleBooking = {
        startDate:'2024-11-25',
        endDate:'2024-11-26',
        name: 'Tyson Levy',
        hotelAddress: "1234 Hotel Ave",
        hotelName: "Test Hotel Suites",
        roomSize: "small",
        numberAdults: 1,
        numberChildren: 0,
        baseRate: 100,
    }
    const [name, setName] = useState(exampleBooking.name)
    const [numberAdults, setNumberAdults] = useState(exampleBooking.numberAdults)
    const [numberChildren, setNumberChildren] = useState(exampleBooking.numberChildren)
    const [startDate, setStartDate] = useState(exampleBooking.startDate)
    const [endDate, setEndDate] = useState(exampleBooking.endDate)
    const [roomSize, setRoomSize] = useState(exampleBooking.roomSize)

    const todayDate = new Date()
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    const today = todayDate.toISOString().split('T')[0]


    let totalCost = (exampleBooking.baseRate * (numberAdults + (numberChildren * .5)) * diffInDays) * (roomSize === "small" ? 1 : roomSize === "medium" ? 1.25 : 1.5)
    
    return (
    <div className='bookingDetails'>
        <h1>Booking Details</h1>
        <div className='checkout'>
            <div className='formTitle'>
                Booking for: {exampleBooking.hotelAddress}
            </div>
            <div className='checkoutForm'>
                <div className='formRow'>
                        <div className="input">
                            <label className="form-label">Start</label>
                            <input type="date" defaultValue={startDate} required="required" min={today} max={minusDay(endDate)} onChange={(e) => {
                                if(e.target.value!=="") {
                                    setStartDate(e.target.value)
                                } else {
                                    let newStartDate = exampleBooking.startDate > endDate ? today : exampleBooking.startDate
                                    e.target.value = newStartDate
                                    setStartDate(newStartDate)
                                }
                                }}>
                            </input>                        
                        </div>
                        <div className="input">
                            <label className="form-label">End</label>
                            <input type="date" defaultValue={endDate} required="required" min={addDay(startDate)} onChange={(e) => {
                                if(e.target.value!=="") {
                                    setEndDate(e.target.value)
                                } else {
                                    e.target.value = addDay(startDate)
                                    setEndDate(addDay(startDate))
                                }
                                }}>
                            </input>
                        </div>
                        <div className="input">
                            <label className="form-label">Name</label>
                            <input defaultValue={name} onChange={(e) => setName(e.target.value)}></input>
                        </div>
                </div>
                <div className='formRow'>
                    <div className="input">
                        <label className="form-label">Room Size</label>
                        <select name='roomSize' id='roomSize' defaultValue={roomSize} onChange={(e) => setRoomSize(e.target.value)}>
                            <option value='small'>Small</option>
                            <option value='medium'>Medium</option>
                            <option value='large'>Large</option>
                        </select>    
                    </div>
                    <div className="input">
                        <label className="form-label">Number of Adults</label>
                        <input type="number" min={1} defaultValue={numberAdults} onChange={(e) => setNumberAdults(parseInt(e.target.value))}></input>
                    </div>
                    <div className="input">
                        <label className="form-label">Number of Children</label>
                        <input type="number" min={0} defaultValue={numberChildren} onChange={(e) => setNumberChildren(parseInt(e.target.value))}></input>
                    </div>
                </div>
            </div>
        </div>
        <div className='confirm'>
            <div style={{paddingRight:".5rem"}}>Total Booking Cost: ${totalCost}</div>
            <button type="submit">
                Continue
            </button>
        </div>
    </div>)
}

function addDay(dateTime) {
    let date = new Date(dateTime);

    // Add one day to the date
    date.setDate(date.getDate() + 1);

    // Convert the date back to a string
    let newDateString = date.toISOString().split('T')[0];

    return newDateString
}

function minusDay(dateTime) {
    let date = new Date(dateTime);

    // Add one day to the date
    date.setDate(date.getDate() - 1);

    // Convert the date back to a string
    let newDateString = date.toISOString().split('T')[0];

    return newDateString
}

export default Checkout;
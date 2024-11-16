import { React, useState } from 'react'
import "./checkout.css"

export function Checkout() {
    let exampleBooking = {
        startDate:'2024-11-16',
        endDate:'2024-11-17',
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

    const today = new Date()
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = new Date(exampleBooking.endDate).getTime() - new Date(exampleBooking.startDate).getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    
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
                            <input type="date" defaultValue={exampleBooking.startDate} min={today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()}></input>
                        </div>
                        <div className="input">
                            <label className="form-label">End</label>
                            <input type="date" defaultValue={exampleBooking.endDate}></input>
                        </div>
                        <div className="input">
                            <label className="form-label">Name</label>
                            <input defaultValue={name} onChange={(e) => setName(e.target.value)}></input>
                        </div>
                </div>
                <div className='formRow'>
                    <div className="input">
                        <label className="form-label">Room Size</label>
                        <select name='roomSize' id='roomSize'>
                            <option value='small'>Small</option>
                            <option value='medium'>Medium</option>
                            <option value='large'>Large</option>
                        </select>    
                    </div>
                    <div className="input">
                        <label className="form-label">Number of Adults</label>
                        <input type="number" min={0} defaultValue={numberAdults} onChange={(e) => setNumberAdults(parseInt(e.target.value))}></input>
                    </div>
                    <div className="input">
                        <label className="form-label">Number of Children</label>
                        <input type="number" min={0} defaultValue={numberChildren} onChange={(e) => setNumberChildren(parseInt(e.target.value))}></input>
                    </div>
                </div>
            </div>
        </div>
        <div className='confirm'>
            <div style={{paddingRight:".5rem"}}>Total Booking Cost: ${exampleBooking.baseRate * (numberAdults + (numberChildren * .5)) * diffInDays}</div>
            <button type="submit">
                Search
            </button>
        </div>
    </div>)
}

export default Checkout;
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, getBookings } from "../../firebase/firebase";
import "./bookings.css";

const Bookings = () => {
	const [bookings, setBookings] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		getBookings(auth.currentUser.uid).then((bookingsData) => {
			setBookings(bookingsData.bookings)
		});
	}, {});

	return(
		<div className="existingBookingsContainer">
			<h1>Existing Bookings</h1>
			<p>Click a booking to view or edit details</p>
			<div className="bookingsContainer">
				{bookings.length === 0 ? <p>No Bookings Found</p> : bookings.map((booking) => {
					const startDate = booking.checkInDate.split("-");
					const endDate = booking.checkOutDate.split("-");
					return(
						<div className="booking" onClick={() => {navigate(`/editbooking/${booking.docId}`)}}>
							<p>Booking for {startDate[1]}/{startDate[2]}/{startDate[0]} - {endDate[1]}/{endDate[2]}/{endDate[0]} at {booking.hotelName}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Bookings;

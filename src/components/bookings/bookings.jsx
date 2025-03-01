import "./bookings.css";

const Bookings = () => {
	return(
		<div className="existingBookingsContainer">
			<h1>Existing Bookings</h1>
			<p>Click a booking to view or edit details</p>
			<div className="bookingsContainer">
				<div className="booking">
					<p>Booking for 11/11/2025 - 11/13/2025 as 1234 Hotel Ave</p>
				</div>
				<div className="booking">
					<p>Booking for 11/12/2025 - 11/14/2025 as 1234 Hotel Ave</p>
				</div>
			</div>
		</div>
	);
};

export default Bookings;

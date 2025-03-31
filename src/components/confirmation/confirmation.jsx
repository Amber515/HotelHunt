import { useNavigate } from 'react-router-dom';
import './confirmation.css';


function Confirmation (){ 
    const navigate = useNavigate();
    return(
        <div className="confirmation-container">
            <h1>Thank you for your reservation!</h1>
            <button onClick={() => navigate('/')}>Return Home</button>
        </div>
    )
}

export default Confirmation;
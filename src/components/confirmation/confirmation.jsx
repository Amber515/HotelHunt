import { useNavigate } from 'react-router-dom';

function Confirmation (){ 
    const navigate = useNavigate();
    return(
        <div>
            <h1>Thank you for your order!</h1>
            <button onClick={() => navigate('/')}>Return Home</button>
        </div>
    )
}


export default Confirmation;
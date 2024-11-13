import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import "./header.css"

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <div className='navbar'>
            
                <div className='logo'>
                    <h1 onClick={() => navigate('home')}>Hotel Hunt</h1>
                </div>

                <div className='links'>
                {userLoggedIn
                    ?
                        <Link style={{color: "black"}} onClick={() => { doSignOut().then(() => { navigate('/login') }) }}>Logout</Link>
                    :
                        <>
                            <Link style={{paddingRight: "2rem", color: "black"}} to={'/login'}>Login</Link>
                            <Link style={{color: "black"}} to={'/register'}>Register</Link>
                        </>
                }
                </div>
                
        </div>
    )
}

export default Header
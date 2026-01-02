import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
const Navbar = () => {
    const {user,isAuthenticated,setUser} = useAuth();
  return (
    <nav>
        <Link to="/">Posts</Link>

        {
            isAuthenticated ? (
                <> 
                <img src={user.avatar} alt="avatar" width={30} height={30} />
                <Link to="/profile">{user.username}</Link> 
                <button onClick={() => setUser(null)}>Logout</button>
                </>
            ) : (
                <>
                <Link to='/login'>Login</Link>
                <Link to='/register'>Register</Link>
                </>
            )
        }   
    </nav>
  )
}

export default Navbar

import { createContext, useEffect, useState } from 'react'
import {getMe} from '../api/auth.js'

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const loadUser = async()=>{
            try {
                const res = await getMe();
                setUser(res.data.user);
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }

        }

        loadUser()
    },[])
    return (
        <AuthContext.Provider
            value = {{
                user,
                isAuthenticated: !!user,
                loading,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}




import React, { useState, useEffect, createContext } from 'react';
import { valid } from '../api/authApi';
import { CircularProgress } from '@mui/material'
import { Navigate } from 'react-router-dom'

export const AuthContext = createContext(null)
export default function AuthProvider({ children }) {
    const [authState, setAuthState] = useState(
        import.meta.env.VITE_DEV_BYPASS === 'true' ? true : null
    )
    const [usernameContext, setUsernameContext] = useState(null)
    
    useEffect(() => {
        if (import.meta.env.VITE_DEV_BYPASS === 'true') {
            setAuthState(true)
            setUsernameContext('dev')
            return
        }
        valid()
            .then((resp) => {
                setAuthState(true); 
                setUsernameContext(resp.data.username);
            } )
            .catch(() => setAuthState(false))
    }, [])

    if (authState === null) return (
        <>
            <CircularProgress color="inherit" />
        </>
    )
    if (authState === true) return (    
        <>
            <AuthContext.Provider value={{ usernameContext, authState }}>    
                {children}
            </AuthContext.Provider>
        </>
    )
    return <Navigate to="/login" />
}

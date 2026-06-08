import React, { useState, children, useEffect } from 'react';
import { valid } from '../api/authApi';
import { CircularProgress } from '@mui/material'
import { Navigate } from 'react-router-dom'

export default function AuthProvider({ children }) {
    const [authState, setAuthState] = useState(null)
    
    useEffect(() => {
        valid()
            .then(() => setAuthState(true))
            .catch(() => setAuthState(false))
    }, [])

    if (authState === null) return <CircularProgress color="inherit" />
    if (authState === true) return children
    return <Navigate to="/login" />
}

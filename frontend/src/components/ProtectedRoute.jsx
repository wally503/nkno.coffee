import { CircularProgress } from '@mui/material'
import { Outlet, Navigate } from 'react-router-dom'
import { valid } from '../api/authApi'
import React, { useState, useEffect } from 'react';

export default function ProtectedRoute() {
    const [authState, setAuthState] = useState(null)
    
    useEffect(() => {
        valid()
            .then(() => setAuthState(true))
            .catch(() => setAuthState(false))
    }, [])

    if (authState === null) return <CircularProgress color="inherit" />
    if (authState === true) return <Outlet />
    return <Navigate to="/login" />
}
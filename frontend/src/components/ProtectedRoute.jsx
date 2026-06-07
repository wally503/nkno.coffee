import { CircularProgress } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { valid } from '../api/authApi'
import React, { useState, useEffect } from 'react';

export default function ProtectedRoute() {
    const [authState, setAuthState] = useState(null)
    
    useEffect(() => {
        valid().then(response => setAuthState(response))
    }, [])


    if (authState === null) return <CircularProgress color="inherit" aria-label="Loading…" />
    
    function validate() {
        if (authState.good) {
            return <Outlet />
        } else {
            return <Navigate to="/login" />
        }
    }


}